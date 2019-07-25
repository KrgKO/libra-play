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

## More about move
- `./libra/target/debug/compiler ./move/example.mvir -o example.out` - Save compiled bytecode to *.out
- Then `hexdump *.out` to change as OPCODE
```
0000000 494c 5242 5641 0a4d 0001 0107 004a 0000
0000010 0004 0000 4e03 0000 0900 0000 0c00 0057
0000020 0000 000a 0000 610d 0000 0600 0000 0500
0000030 0067 0000 0031 0000 9804 0000 2000 0000
0000040 0700 00b8 0000 0028 0000 0000 0100 0200
0000050 0100 0103 0401 0200 0200 0204 0102 0102
0000060 0304 0404 0402 0602 533c 4c45 3e46 4c0c
0000070 6269 6172 6341 6f63 6e75 0474 616d 6e69
0000080 6207 6c61 6e61 6563 700f 7961 665f 6f72
0000090 5f6d 6573 646e 7265 0000 0000 0000 0000
00000a0 0000 0000 0000 0000 0000 0000 0000 0000
00000b0 0000 0000 0000 0000 0100 0004 000f 0d2b
00000c0 0c02 1102 0d01 0c03 0603 000a 0000 0000
00000d0 0000 0b17 2401 0e04 0c00 0c00 1101 0202
00000e0
```
- To convert to oneline by `xxd -c 100000 -p *.out`
```
4c49425241564d0a010007014a00000004000000034e000000090000000c570000000a0000000d610000000600000005670000003100000004980000002000000007b8000000280000000000000100020001030101040002000204020201020104030404020402063c53454c463e0c4c696272614163636f756e74046d61696e0762616c616e63650f7061795f66726f6d5f73656e6465720000000000000000000000000000000000000000000000000000000000000000000104000f002b0d020c0211010d030c03060a00000000000000170b0124040e000c000c01110202
```