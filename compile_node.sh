#/bin/bash

echo "Start local libra node..."

cd ./libra
cp ../transaction_scripts/peer_to_peer_transfer.mvir language/stdlib/transaction_scripts/peer_to_peer_transfer.mvir
ls -la language/stdlib/transaction_scripts/

# reference https://developers.libra.org/docs/my-first-transaction#run-a-local-validator-node
cargo run -p libra_swarm -- -s