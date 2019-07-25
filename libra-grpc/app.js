const protoLoader = require("@grpc/proto-loader");
const grpcLibrary = require("grpc");
const path = require("path");
const protobuf = require("protobufjs");

const HOST = "ac.testnet.libra.org:8000";

function main(cmd, params) {
  const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "./proto/admission_control.proto"),
    {
      keepCase: true,
      longs: Number,
      enums: String,
      defaults: true,
      bytes: Array,
      oneofs: true
    }
  );

  const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition);
  const client = new packageObject.admission_control.AdmissionControl(
    HOST,
    grpcLibrary.credentials.createInsecure()
  );

  client.updateToLatestLedger(
    {
      client_known_version: 0,
      requested_items: [{ [`${cmd}_request`]: params }]
    },
    (e, r) => {
      if (e) {
        console.error(e);
        return;
      }

      const response = r.response_items[0][`${cmd}_response`];
      if (response.signed_transaction_with_proof) {
        console.log("===> sender");
        protobuf.load(
          path.join(__dirname, "./proto/transaction.proto"),
          (err, root) => {
            if (err) {
              console.error(err);
              return;
            }

            const extractor = root.lookupType("types.RawTransaction");
            const raw_msg = extractor.decode(
              r.response_items[0][`${cmd}_response`]
                .signed_transaction_with_proof.signed_transaction.raw_txn_bytes
            );
            console.log(raw_msg);
          }
        );
      } else if (response.proof_of_current_sequence_number) {
        console.log("===> receiver");
        console.log(response.proof_of_current_sequence_number);
      }
    }
  );
}

// 56cfd6d18e6b01713e01508d2da07184939ca8dccf52f6855066eb5ab5292172 - sender
// 935686ca53960b4a4b1b2d0b6da3488862e36d2cfab34c0a705811d5073ca403 - receiver
main("get_account_transaction_by_sequence_number", {
  account: Buffer.from(
    "935686ca53960b4a4b1b2d0b6da3488862e36d2cfab34c0a705811d5073ca403",
    "hex"
  ),
  sequence_number: 0,
  fetch_events: true
});
