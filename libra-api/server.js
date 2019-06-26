const app = require("express")();
const { spawn } = require("child_process");
const {
  streamWrite,
  streamEnd,
  chunksToLinesAsync,
  onExit,
  chomp
} = require("@rauschma/stringio");

const port = process.env.PORT || "7007";
const mnemonic_path = process.env.WALLET_PATH || "/tmp/libra-wallet";

async function write(writable, cmd) {
  await streamWrite(writable, cmd);
  await streamEnd(writable);
}

async function read(readable) {
  let addr = {};

  for await (const line of chunksToLinesAsync(readable)) {
    if (line.includes("account #0 address")) {
      addr = /[0-9a-f]{64}/.exec(line)[0];
    }
  }

  return {
    addr
  };
}

app.get("/account/create", async (req, res) => {
  const cli = spawn(
    "docker",
    [
      "run",
      "-v",
      "./libra-wallet:/tmp/libra-wallet",
      "--rm",
      "-i",
      "libra:1.0.0"
    ],
    {
      stdio: ["pipe", "pipe"]
    }
  );

  await write(cli.stdin, "a c\n");
  const { addr } = await read(cli.stdout);

  return res.json({ addr });
});

app.post("/account/mint", (req, res) => {});

app.post("/transfer", (req, res) => {});

app.get("/query/balance/:account", (req, res) => {});

app.get("/query/txseq/:account", (req, res) => {});

app.listen(port, () => {
  console.info("app listened on port", port);
});
