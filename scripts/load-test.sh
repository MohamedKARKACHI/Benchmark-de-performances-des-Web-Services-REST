#!/bin/bash

VARIANT=$1
PORT=$2
SCENARIO=$3

if [ -z "$VARIANT" ] || [ -z "$PORT" ] || [ -z "$SCENARIO" ]; then
    echo "Usage: ./load-test.sh <variant-c|variant-d> <port> <scenario-number>"
    exit 1
fi

echo "Running $SCENARIO on $VARIANT (port $PORT)..."
jmeter -n -t "jmeter/scenarios/$SCENARIO-*.jmx" \
  -Jhost=localhost \
  -Jport=$PORT \
  -l "results/$VARIANT-$SCENARIO.jtl" \
  -j "logs/$VARIANT-$SCENARIO.log"

echo "Test complete. Results saved to results/$VARIANT-$SCENARIO.jtl"
