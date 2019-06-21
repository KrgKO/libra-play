# Libra-play

To play libra with know nothing
Reference: https://developers.libra.org/docs/my-first-transaction

To start cli `./scripts/cli/start_cli_testnet.sh` - inside libra folder (after setting up)

## Explanations
1. Account create `account create` - Will create account for libra and stored in memory which can retrieve by reference index of account **Note: if restart cli all account will be gone**
2. Mint (Issue the coin by guarantee any asset) `account mint {index} {amount}` - Coins will added to target account
3. Retrieve transaction by account `query sequence {index}` - Will show transaction(s) which is using that account (reference by index) as source account
4. Transfering coin `transfer {source_index} {target_index} {amount}` - Reference: https://developers.libra.org/docs/life-of-a-transaction
5. Query balance `query balance {index}` - Will query balance of target account by index

## Move
https://developers.libra.org/docs/move-overview#writing-transaction-scripts

## Test own transaction script
The example transaction script store at transaction_scripts folder and start deployment by
```
./compile_node.sh
```
Starting local peer takes around 10-15 mins

## Documentation
https://developers.libra.org/docs/welcome-to-libra