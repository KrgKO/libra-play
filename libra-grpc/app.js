const protoLoader = require("@grpc/proto-loader");
const grpcLibrary = require("grpc");
const path = require("path");

function main() {
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
    "ac.testnet.libra.org:8000",
    grpcLibrary.credentials.createInsecure()
  );
  const params = {
    account: Buffer.from(
      "435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4",
      "hex"
    ),
    sequence_number: 1,
    fetch_events: true
  };
  client.updateToLatestLedger(
    {
      client_known_version: 0,
      requested_items: [
        { get_account_transaction_by_sequence_number_request: params }
      ]
    },
    (e, r) => {
      console.log(
        "\n\n",
        r.response_items[0].get_account_transaction_by_sequence_number_response
          .proof_of_current_sequence_number
      );
    }
  );
}

main();
