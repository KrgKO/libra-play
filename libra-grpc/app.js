const protoLoader = require("@grpc/proto-loader");
const grpcLibrary = require("grpc");
const path = require("path");

const HOST = "ac.testnet.libra.org:8000";

function main(cmd, params) {
  const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "./proto/admission_control.proto"),
    {
      keepCase: true,
      longs: Number,
      enums: String,
      defaults: true,
      bytes: String,
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
      }
      console.info(r.response_items[0][`${cmd}_response`]);
    }
  );
}

main("get_account_transaction_by_sequence_number", {
  account: Buffer.from(
    "12b81b16677a33bf5931b574921905479802aca3aae6a9886716328a3167d9d3",
    "hex"
  ),
  sequence_number: 0,
  fetch_events: true
});
