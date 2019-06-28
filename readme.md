# Libra-play

To play libra with know nothing
Before start everything try to read this https://developers.libra.org/docs/my-first-transaction

To start cli `./scripts/cli/start_cli_testnet.sh` - inside libra folder (after setting up)

## Explanations
1. Account create `account create` - Will create account for libra and stored in memory which can retrieve by reference index of account **Note: if restart cli all account will be gone**
2. Mint (Issue the coin by guarantee any asset) `account mint {index} {amount}` - Coins will added to target account
3. Retrieve transaction by account `query sequence {index}` - Will show transaction(s) which is using that account (reference by index) as source account
4. Transfering coin `transfer {source_index} {target_index} {amount}` - Reference: https://developers.libra.org/docs/life-of-a-transaction
5. Query balance `query balance {index}` - Will query balance of target account by index
6. Retrieve wallet `account recover`

## Move
https://developers.libra.org/docs/move-overview#writing-transaction-scripts

## Test own transaction script with local node
The example transaction script store at transaction_scripts folder and start deployment by
```
./compile_node.sh
```
Starting local peer takes around 10-15 mins

## Libra with docker
Libra repository provide docker file already at `./libra/docker`

Start build by `docker build -f ./docker/client/client.Dockerfile -t libra:1.0.0 .` - need to stay at `./libra` first

## Working with child process
http://2ality.com/2018/05/child-process-streams.html

## To start libra API
Currently libra only have CLI so, we need to call CLI via API by building docker container for libra CLI
 
Execute `cd libra-api && node server.js`

Command line
1. `docker run --rm -it --name libra libra:1.0.0`
2. `echo {command} | docker run --rm -i --name libra libra:1.0.0`

## Documentation
https://developers.libra.org/docs/welcome-to-libra

## How does mnemonic file works
It used for generate account's address and also stored as a key of wallet on libra peer
```
// before generate account
service patch program edit similar casual ghost dad toast cupboard record bonus smoke october random tube meadow keep grain arctic coconut process destroy bus;0

// after generate account
service patch program edit similar casual ghost dad toast cupboard record bonus smoke october random tube meadow keep grain arctic coconut process destroy bus;{running_number}
```
Need to use when want to recover wallet

## Note for transfer libra
If wallet does not exist (does not recover wallet) transfer libra is impossible