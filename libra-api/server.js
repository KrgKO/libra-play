const app = require("express")();
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const util = require("util");
const { exec } = require("shelljs");

const {
  streamWrite,
  streamEnd,
  chunksToLinesAsync
} = require("@rauschma/stringio");

const appendFileAsync = util.promisify(fs.appendFile);

const port = process.env.PORT || "7007";
const mnemonic_path = process.env.WALLET_PATH || "/tmp/libra-wallet";

app.use(bodyParser.json());

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve), ms);
}

async function write(writable, cmd) {
  await streamWrite(writable, cmd);
}

async function end(writable) {
  await streamEnd(writable);
}

function delayExec(cmd) {
  setTimeout(() => {
    exec(cmd);
  }, 500);
}

async function read(readable) {
  const response = {
    transfer: false
  };

  for await (const line of chunksToLinesAsync(readable)) {
    console.log(line);
    if (line.includes("account #0 address")) {
      response.address = /[0-9a-f]{64}/.exec(line)[0];
    } else if (line.includes("Balance is")) {
      response.amount = /[0-9.]+/.exec(line)[0];
    } else if (line.includes("Transaction submitted to validator")) {
      response.transfer = true;
    }
  }

  console.log("[read] read stdout:", response);
  return response;
}

app.post("/account/create", async (req, res) => {
  console.info("[create] account create");
  const cli = spawn(
    "docker",
    ["run", "--rm", "--name", "libra", "-i", "libra:1.0.0"],
    {
      stdio: ["pipe", "pipe"]
    }
  );

  try {
    const mnemonicFile = Date.now();
    await sleep(2000);
    await write(cli.stdin, "a c\n");
    await sleep(1000);
    delayExec(
      `docker exec -i libra sed  "s/;0/;1/g" client.mnemonic >> ../libra-wallet/${mnemonicFile}`
    );

    await end(cli.stdin);
    const { address } = await read(cli.stdout);

    await appendFileAsync(
      "../libra-wallet/wallet",
      `${address}:${mnemonicFile}` + "\n"
    );
    return res.json({ message: "account created", address, mnemonicFile });
  } catch (e) {
    console.error("[create] failed with error:", e);
    return res.status(500).json({ error: "cannot create an account" });
  }
});

app.post("/account/mint/:address", async (req, res) => {
  console.info("[mint] account mint");
  const { address } = req.params;
  const { amount } = req.body;

  if (!address) {
    return res.status(400).json({ message: "address is required" });
  } else if (!amount) {
    return res.status(400).json({ message: "amount is required" });
  }

  const cli = spawn("docker", ["run", "--rm", "-i", "libra:1.0.0"], {
    stdio: ["pipe", "pipe"]
  });

  try {
    await write(cli.stdin, `a m ${address} ${amount}\n`);
    await end(cli.stdin);

    return res.json({ message: `minted ${amount} libras` });
  } catch (e) {
    console.error("[mint] failed with error:", e);
    return res.status(500).json({ error: `cannot mint account ${address}` });
  }
});

app.post("/transfer", async (req, res) => {
  console.info("[transfer] transfer libra");
  const { source, destination, amount, wallet } = req.body;
  let transferSuccess = false;

  try {
    const cli = spawn(
      "docker",
      ["run", "--rm", "--name", "libra", "-i", "libra:1.0.0"],
      {
        stdio: ["pipe", "pipe"]
      }
    );
    await sleep(1000);
    delayExec(`docker cp ../libra-wallet/${wallet} libra:/tmp/user.mnemonic`);
    await write(cli.stdin, `a r /tmp/user.mnemonic\n`);
    await sleep(1000);
    await write(cli.stdin, `t ${source} ${destination} ${amount}\n`);
    await end(cli.stdin);
    const { transfer } = await read(cli.stdout);
    transferSuccess = transfer;

    if (!transferSuccess) {
      const cli = spawn(
        "docker",
        ["run", "--rm", "--name", "libra", "-i", "libra:1.0.0"],
        {
          stdio: ["pipe", "pipe"]
        }
      );
      await sleep(2000);
      delayExec(`docker cp ../libra-wallet/${wallet} libra:/tmp/user.mnemonic`);
      await write(cli.stdin, `a r /tmp/user.mnemonic\n`);
      await sleep(1000);
      // First transfer will retrieve sequence of account
      await write(cli.stdin, `t ${source} ${destination} ${amount}\n`);
      await write(cli.stdin, `t ${source} ${destination} ${amount}\n`);
      await end(cli.stdin);
      const { transfer } = await read(cli.stdout);
      transferSuccess = transfer;
    }

    if (transferSuccess) {
      return res.json({ message: "transfer success" });
    }
    return res.status(500).json({ error: "transfer failed" });
  } catch (e) {
    console.error("[transfer] failed with error:", e);
    return res.status(500).json({ error: "cannot transfer libra" });
  }
});

app.get("/query/balance/:address", async (req, res) => {
  console.info("[balance] query balance");
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({ message: "address is required" });
  }

  const cli = spawn("docker", ["run", "--rm", "-i", "libra:1.0.0"], {
    stdio: ["pipe", "pipe"]
  });

  try {
    await write(cli.stdin, `q b ${address}\n`);
    await end(cli.stdin);
    const { amount } = await read(cli.stdout);

    return res.json({ message: "get balance success", address, amount });
  } catch (e) {
    console.error("[balance] failed with error:", e);
    return res
      .status(500)
      .json({ error: `cannot get balance from ${address}` });
  }
});

app.get("/query/txseq/:address", (req, res) => {});

app.listen(port, () => {
  console.info("app listened on port", port);
});
