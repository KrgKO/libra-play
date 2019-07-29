#!/bin/bash

PROTO=./proto
GENERATED=./generated_proto

echo "Generated protobuf for JS..."

./node_modules/grpc-tools/bin/protoc --version >/dev/null
if [ $? -ne 0 ]; then
    echo "Protoc not found - Install by `npm install`"
    exit 0
fi

if [ ! -d "$GENERATED" ]; then
    mkdir -p ${GENERATED}
fi

./node_modules/grpc-tools/bin/protoc \
--js_out=import_style=commonjs,binary:${GENERATED} \
--grpc_out=${GENERATED} \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I ${PROTO} \
${PROTO}/*.proto

echo "Completed !!!"