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
Now start libra CLI `./script/start_cli_testnet.sh` new command will added to CLI

## While start swarm mode (local node)

By command `cargo run -p libra_swarm -- -s`

Faucet account created in file "/tmp/keypair.{random}/temp_faucet_keys"
Base directory containing logs and configs: "/tmp/.tmp{random}"

What's inside

- **genesis.blob** -> Store all config and account statistic such as hash, balance, sequence number, etc.
- **{hash}.node.config.toml**

``` toml
[base]
peer_id = "8deeeaed65f0cd7484a9e4e5ac51fbac548f2f71299a05e000156031ca78fb9f"
peer_keypairs_file = "8deeeaed65f0cd7484a9e4e5ac51fbac548f2f71299a05e000156031ca78fb9f.node.keys.toml"
data_dir_path = "/tmp/.tmp27S9Ys"
trusted_peers_file = "trusted_peers.config.toml"
node_sync_batch_size = 1000
node_sync_retries = 3
node_sync_channel_buffer_size = 10
node_async_log_chan_size = 256

[metrics]
dir = "metrics"
collection_interval_ms = 1000
push_server_addr = ""

[execution]
address = "localhost"
port = 44319
testnet_genesis = false
genesis_file_location = "genesis.blob"

[admission_control]
address = "0.0.0.0"
admission_control_service_port = 33631
need_to_check_mempool_before_validation = false

[debug_interface]
admission_control_node_debug_port = 43523
secret_service_node_debug_port = 40531
storage_node_debug_port = 45207
metrics_server_port = 38663
address = "0.0.0.0"

[storage]
address = "localhost"
port = 40419
dir = "libradb/8deeeaed65f0cd7484a9e4e5ac51fbac548f2f71299a05e000156031ca78fb9f/db"

[network]
seed_peers_file = "seed_peers.config.toml"
listen_address = "/ip4/0.0.0.0/tcp/46565"
advertised_address = "/ip4/0.0.0.0/tcp/46565"
discovery_interval_ms = 1000
connectivity_check_interval_ms = 5000
enable_encryption_and_authentication = true

[consensus]
max_block_size = 100
proposer_type = "rotating_proposer"
contiguous_rounds = 2

[mempool]
broadcast_transactions = true
shared_mempool_tick_interval_ms = 50
shared_mempool_batch_size = 100
shared_mempool_max_concurrent_inbound_syncs = 100
capacity = 10000000
capacity_per_user = 100
sequence_cache_capacity = 1000
system_transaction_timeout_secs = 86400
system_transaction_gc_interval_ms = 180000
mempool_service_port = 45305
address = "localhost"

[log_collector]
is_async = true
use_std_output = true
[vm_config.publishing_options]
type = "Locked"
whitelist = ["88c0c64595f6cec7d0c0bfe29e1be1886c736ec3d26888d049e30909f7a72836", "2bb3828f55bc640a85b17d9c6e120e84f8c068c9fd850e1a1d61d2f91ed295fd", "ee31d65b559ad5a300e6a508ff3edb2d23f1589ef68d0ead124d8f0374073d84", "d3493756a00b7a9e4d9ca8482e80fd055411ce53882bdcb08fec97d42eef0bde"]

[secret_service]
address = "localhost"
secret_service_port = 43543
```

- **{hash}.node.keys.toml**

``` txt
network_signing_private_key = "200000000000000082001573a003fd3b7fd72ffb0eaf63aac62f12deb629dca72785a66268ec758b"
network_signing_public_key = "2000000000000000664f6e8f36eacb1770fa879d86c2c1d0fafea145e84fa7d671ab7a011a54d509"
network_identity_private_key = "200000000000000018db36900560898178e0ad009abf1f491330dc1c246e3d6cb264f6900271d55c"
network_identity_public_key = "2000000000000000b1df0ea1b4c1400454bab824e2e3ef6669e4231e2b9332020d9630fe1cfb2808"
consensus_private_key = "2000000000000000fb1c12c1efcb64c5603ca15ac896d1abc1082b17b096c9176547992eaa0eb646"
```

- **seed_peers.config.toml**

``` toml
[seed_peers]
8deeeaed65f0cd7484a9e4e5ac51fbac548f2f71299a05e000156031ca78fb9f = ["/ip4/0.0.0.0/tcp/46565"]
```

- **trusted_peers.config.toml**

``` toml
[peers.8deeeaed65f0cd7484a9e4e5ac51fbac548f2f71299a05e000156031ca78fb9f]
network_signing_pubkey = "2000000000000000664f6e8f36eacb1770fa879d86c2c1d0fafea145e84fa7d671ab7a011a54d509"
network_identity_pubkey = "2000000000000000b1df0ea1b4c1400454bab824e2e3ef6669e4231e2b9332020d9630fe1cfb2808"
consensus_pubkey = "200000000000000090bba9133465da772eea2823cd0d871dbf0f27580ec8b791ebfa21ce18baae7a"
```
