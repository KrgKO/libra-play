# Move

Move is a smart contract language for libra
Recommended commit: 0ba0013fd8db3bafd23b80e11f15027b5588e6c1

If need to read the [old_version](./readme_old.md).

## Deployment steps

1. Able to start libra node as swarm with command `cargo run -p libra_swarm -- -s`
2. Prepare transaction script
3. Able to compile transaction script

    ``` sh
    # To build compiler binary
    cargo build --bin compiler

    # Call compiler
    cd libra
    ./target/debug/compiler -o ../move/example.program ../move/example.mvir
    ```

    Example output:

    ``` JSON
    {"code":[76,73,66,82,65,86,77,10,1,0,7,1,74,0,0,0,4,0,0,0,3,78,0,0,0,9,0,0,0,12,87,0,0,0,12,0,0,0,13,99,0,0,0,8,0,0,0,5,107,0,0,0,49,0,0,0,4,156,0,0,0,32,0,0,0,7,188,0,0,0,42,0,0,0,0,0,0,1,0,2,0,1,3,1,1,4,0,2,0,2,4,2,0,2,1,2,1,4,0,3,0,3,4,4,2,4,2,6,60,83,69,76,70,62,12,76,105,98,114,97,65,99,99,111,117,110,116,4,109,97,105,110,7,98,97,108,97,110,99,101,15,112,97,121,95,102,114,111,109,95,115,101,110,100,101,114,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,15,0,43,13,2,12,2,17,1,0,13,3,12,3,6,10,0,0,0,0,0,0,0,23,11,1,36,4,14,0,12,0,12,1,17,2,0,2],"args":[],"modules":[]}
    ```

4. Make transaction

    ``` sh
    # Compile transaction builder
    cd libra/language/transaction_builder
    cargo build --features='build-binary'
    cd ../..

    # Execute transaction builder
    ./target/debug/transaction_builder 8c42c6890f79b6a52f88c44ba04483ba5624e96c53ed2165c15de3d115dbefea 3 ../move/example.compiled ../move/example.txn --args 0x91d27bab1ee84af7f5e5eea8e220665cd9d136652eb35aad9725c8de1934bc0e 95000000

    ./target/debug/transaction_builder <sender> <sequence_number> <program> <transaction_output> <payee> <amount>

    # Do not forget to put 0x in front of payee
    ```

    **Note:** Before build transaction need to create account first for using as sender and payee
    **Note2:** For amount need to input as X*10^6

5. Execute transaction

    At libra cli swarm mode

    ``` sh
    # Command
    usage: dev <arg>

    Use the following args for this command:

    compile | c <sender_account_address>|<sender_account_ref_id> <file_path> [is_module (default=false)] [output_file_path (compile into tmp file by default)]
        Compile move program
    publish | p <sender_account_address>|<sender_account_ref_id> <compiled_module_path>
        Publish move module on-chain
    execute | e <sender_account_address>|<sender_account_ref_id> <compiled_module_path> [parameters]
        Execute custom move script
    submit | submitb | s | sb 
        <signer_account_address>|<signer_account_ref_id> <path_to_raw_transaction> Suffix 'b' is for blocking. 
        Load a RawTransaction from file and submit to the network
    ```

    Example:

    ``` sh
    libra% dev s 59531ef25b76adba4a910a64aea6c8ab7ba1cb1a8187b21daa30dabcafc0adfa /path/to/libra-play/move/example.txn
    Transaction submitted to validator
    To query for transaction status, run: query txn_acc_seq 59531ef25b76adba4a910a64aea6c8ab7ba1cb1a8187b21daa30dabcafc0adfa 0 <fetch_events=true|false>
    libra% query txn_acc_seq 59531ef25b76adba4a910a64aea6c8ab7ba1cb1a8187b21daa30dabcafc0adfa 0 true
    >> Getting committed transaction by account and sequence number
    Committed transaction: SignedTransaction {
    raw_txn: RawTransaction {
        sender: 59531ef25b76adba4a910a64aea6c8ab7ba1cb1a8187b21daa30dabcafc0adfa,
        sequence_number: 0,
        payload: {,
            transaction: <unknown transaction>,
            args: [
                {ADDRESS: f658f56b7ecfa018fe44f11db442e563d4e888b9e43c7746eb0af4576ebac67c},
                {U64: 95000000},
            ]
        },
        max_gas_amount: 1000000,
        gas_unit_price: 0,
        expiration_time: 18446744073709551615s,
    },
    public_key: 144e6fee8f9a9355bdaa062a59ab4ec8fc76b1f00520246a40df2d439316be05,
    signature: Signature( R: CompressedEdwardsY: [27, 97, 228, 47, 17, 15, 51, 207, 207, 184, 82, 239, 188, 159, 52, 94, 180, 245, 2, 220, 1, 229, 243, 239, 246, 131, 119, 15, 196, 120, 3, 20], s: Scalar{
        bytes: [212, 62, 236, 199, 74, 16, 209, 234, 121, 57, 202, 247, 91, 48, 132, 199, 142, 145, 92, 67, 91, 165, 180, 11, 99, 67, 143, 232, 113, 123, 167, 10],
    } ),
    }
    Events:
    ContractEvent { access_path: AccessPath { address: 59531ef25b76adba4a910a64aea6c8ab7ba1cb1a8187b21daa30dabcafc0adfa, type: Resource, hash: "217da6c6b3e19f1825cfb2676daecce3bf3de03cf26647c78df00b371b25cc97", suffix: "/sent_events_count/" } , index: 0, event_data: AccountEvent { account: f658f56b7ecfa018fe44f11db442e563d4e888b9e43c7746eb0af4576ebac67c, amount: 95000000 } }
    ContractEvent { access_path: AccessPath { address: f658f56b7ecfa018fe44f11db442e563d4e888b9e43c7746eb0af4576ebac67c, type: Resource, hash: "217da6c6b3e19f1825cfb2676daecce3bf3de03cf26647c78df00b371b25cc97", suffix: "/received_events_count/" } , index: 0, event_data: AccountEvent { account: 59531ef25b76adba4a910a64aea6c8ab7ba1cb1a8187b21daa30dabcafc0adfa, amount: 95000000 } }
    libra% q b 0
    Balance is: 5.000000
    libra% q b 1
    Balance is: 95.000000
    ```
