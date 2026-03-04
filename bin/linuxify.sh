#!/bin/bash

# Linuxify Sudo Wrapper
# This script preserves the user's environment and runs Linuxify with full root access
# Usage: sudo /path/to/linuxify.sh [options]

# Find the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Find node executable
NODE_EXEC=$(command -v node)
if [ -z "$NODE_EXEC" ]; then
    echo "Error: Node.js not found in PATH"
    exit 1
fi

# Run the Node.js linuxify CLI with preserved PATH
exec "$NODE_EXEC" "$SCRIPT_DIR/linuxify" "$@"
