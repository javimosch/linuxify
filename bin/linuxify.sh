#!/bin/bash

# Linuxify Sudo Wrapper
# This script preserves the user's environment and runs Linuxify with full root access
# Usage: sudo -E bash /path/to/linuxify.sh [options]
#    or: sudo PATH=$PATH bash /path/to/linuxify.sh [options]

# Find the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Find node executable
NODE_EXEC=$(command -v node 2>/dev/null)

if [ -z "$NODE_EXEC" ]; then
    echo "Error: Node.js not found in PATH"
    echo ""
    echo "When using sudo, you need to preserve the PATH variable:"
    echo ""
    echo "Use one of these commands:"
    echo "  1. sudo -E bash bin/linuxify.sh        (preserve environment)"
    echo "  2. sudo PATH=\$PATH bash bin/linuxify.sh (preserve just PATH)"
    echo ""
    echo "Or find node path manually:"
    echo "  1. Run: which node"
    echo "  2. Then: sudo /full/path/to/node bin/linuxify"
    exit 1
fi

# Run the Node.js linuxify CLI
exec "$NODE_EXEC" "$SCRIPT_DIR/linuxify" "$@"
