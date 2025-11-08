#!/bin/bash

# One-time setup and run script

echo "Setting up REST Performance Benchmark..."

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Make scripts executable
chmod +x start-project.sh
chmod +x quick-start.sh
chmod +x stop-project.sh

# Run the main startup script
./start-project.sh
