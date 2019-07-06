# Move

Move is a smart contract language for libra

## Change VM mode

Change mode of vm from **Locked** to **Open** at `vm_config.mvir` because it will accept only validated smart contract if need to deploy on local node

## To build compiler

At ./libra
```
    cargo build --bin compiler
```
To build compiler to compile mvir to byte code

To compile a file
```
    ./libra/target/debug/compiler <filename.mvir>
```

Example:
```
    CompiledProgram: {
    Modules: [
    ],
    Script: CompiledScript: {
    Main:
        public 0x0.<SELF>.main(Address, Integer): ()
            locals(0): Address, Integer, Address, Integer,
            GetTxnSenderAddress
            StLoc(2)
            MoveLoc(2)
            Call(0x0.LibraAccount.balance(Address): (Integer))
            StLoc(3)
            MoveLoc(3)
            LdConst(10)
            Sub
            CopyLoc(1)
            Gt
            BrFalse(14)
            MoveLoc(0)
            MoveLoc(1)
            Call(0x0.LibraAccount.pay_from_sender(Address, Integer): ())
            Ret
    Struct Handles: []
    Module Handles: [
        0x0.<SELF>,
        0x0.LibraAccount,]
    Function Handles: [
        0x0.<SELF>.main(Address, Integer): (),
        0x0.LibraAccount.balance(Address): (Integer),
        0x0.LibraAccount.pay_from_sender(Address, Integer): (),]
    Type Signatures: []
    Function Signatures: [
        (Address, Integer): (),
        (Address): (Integer),]
    Locals Signatures: [
        Address, Integer, Address, Integer,]
    Strings: [
        <SELF>,
        LibraAccount,
        main,
        balance,
        pay_from_sender,]
    ByteArrays: []
    Addresses: [
        0x0,]
    }

    }
```

Reference: https://developers.libra.org/docs/crates/ir-to-bytecode