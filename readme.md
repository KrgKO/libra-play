# Libra-play

Before start everything try to read this https://developers.libra.org/docs/my-first-transaction

Or follow these steps

- Clone libra github `git clone https://github.com/libra/libra.git`
- `cd libra && ./scripts/dev_setup.sh` - If need to compile Libra source code on local machine
- To start cli `./scripts/cli/start_cli_testnet.sh` - inside libra folder (after setting up)

**Note:**

- Libra repository commit: 737839b744794c0ca3be3db2934de7ebf056639a for earier test
- Current commit: dfdcbb69f4cea6640d0e592e51202a4a9b9f08ba

## Command Line Explanations

1. Account create `account create` - Will create account for libra and stored in memory which can retrieve by reference index of account **Note: if restart cli all account will be gone**
2. Mint (Issue the coin by guarantee any asset) `account mint {index} {amount}` - Coins will added to target account
3. Retrieve transaction by account `query sequence {index}` - Will show transaction(s) which is using that account (reference by index) as source account
4. Transfering coin `transfer {source_index} {target_index} {amount}` - Reference: https://developers.libra.org/docs/life-of-a-transaction
5. Query balance `query balance {index}` - Will query balance of target account by index
6. Retrieve wallet `account recover`

## Test own transaction script with local node

The example transaction script store at transaction_scripts folder and start deployment by

``` sh
./compile_node.sh
```

Starting local peer takes around 10-15 mins

## Libra with docker

Libra repository provide docker file already at `./libra/docker`

Start build by `docker build -f ./docker/client/client.Dockerfile -t libra:1.0.0 .` - need to stay at `./libra` first

Can start libra command line via these commands

1. `docker run --rm -it --name libra libra:1.0.0`
2. `echo {command} | docker run --rm -i --name libra libra:1.0.0` - run command via tty

## NodeJS child_process and shell

Sometimes child_process cannot do multiple thing in the mean time like if want to read file and execute command we cannot control the flow. So, we need to use 2 library that will be able to execute command in the mean time (difference process in term of event loops)

reference: http://2ality.com/2018/05/child-process-streams.html

## How does mnemonic file works

It used for generate account's address and also stored as a key of wallet on libra peer

``` txt
// before generate account
service patch program edit similar casual ghost dad toast cupboard record bonus smoke october random tube meadow keep grain arctic coconut process destroy bus;0

// after generate account
service patch program edit similar casual ghost dad toast cupboard record bonus smoke october random tube meadow keep grain arctic coconut process destroy bus;{running_number}
```

Need to use when want to recover wallet

## Note for transfer libra

If wallet does not exist (does not recover wallet) transfer libra is impossible. **Sender must to stay in current libra client's walllet**

Weird thing when recover transaction then transfer with scenerio

``` sh
    create account
    create account
    mint 0 100
    transfer 0 > 1 10
    write mnemonic_wallet
    recover mnemonic_wallet
    transfer 0 > 1 10 # failed

    # workaround
    transfer 0 > 1 10 # failed
    transfer 0 > 1 10 # success
```

It failed because sequence of **account has been resetted after recover account**.
First transfering will `retrieve sequence` and second transfering will be `able to transfer`

## Libra Reference

- https://developers.libra.org/docs/welcome-to-libra
- https://developers.libra.org/docs/move-overview#writing-transaction-scripts

## Try to modify libra CLI

**Note:** This is not a recommended solution to modify source code

- Start at `./client/src`
- Create new file such as `whoami_commands.rs`

``` rust
use crate::{client_proxy::ClientProxy, commands::*};

pub struct WhoamiCommand {}

impl Command for WhoamiCommand {
    fn get_aliases(&self) -> Vec<&'static str> {
        vec!["whoami", "i"]
    }
    fn get_description(&self) -> &'static str {
        "Who am i"
    }
    fn execute(&self, client: &mut ClientProxy, params: &[&str]) {
        println!("IT\'S MEEE");
        return;
    }
}
```

- To make `main.rs` file know that new library exists by modify `lib.rs`

``` rust
pub(crate) mod _______________;
pub(crate) mod whoami_commands;
```

Add this line below a set of crates

- To prepare command need to interact with `commands.rs`

Import command by

``` rust
use crate::{
    ...., whoami_commands::WhoamiCommand,
};
```

Then add command to vector

``` rust
    let commands: Vec<Arc<dyn Command>> = vec![
        ...
        Arc::new(WhoamiCommand {}),
    ];
```

Now start libra CLI `./script/start_cli_testnet.sh` new command will added to CLI

## Cargo build failed

Can fix follow `https://github.com/libra/libra/issues/147`
