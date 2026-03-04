#!/bin/bash

##############################################################################
# Linuxify Sudoers Setup Script
# Automatically configures passwordless sudo for Linuxify commands
# Usage: sudo bash setup.sh
##############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
   echo -e "${RED}Error: This script must be run with sudo${NC}"
   echo "Usage: sudo bash setup.sh"
   exit 1
fi

echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║  Linuxify Sudoers Configuration Script                    ║${NC}"
echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Define the sudoers rules
read -r -d '' SUDOERS_RULES << 'EOF'
# Linuxify - systemctl commands
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl disable *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl stop *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl mask *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl unmask *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl enable *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl start *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl restart *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl reload *

# Linuxify - cleanup commands
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt clean
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt autoremove -y
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt autoremove --purge -y
%sudo ALL=(ALL) NOPASSWD: /usr/bin/journalctl --vacuum-time=7d
%sudo ALL=(ALL) NOPASSWD: /usr/bin/journalctl --vacuum-size=500M
%sudo ALL=(ALL) NOPASSWD: /usr/bin/flatpak remove --unused -y
%sudo ALL=(ALL) NOPASSWD: /usr/bin/dnf clean all
%sudo ALL=(ALL) NOPASSWD: /usr/bin/pacman -Sc --noconfirm
%sudo ALL=(ALL) NOPASSWD: /usr/bin/rm -rf /tmp/*
%sudo ALL=(ALL) NOPASSWD: /usr/bin/rm -rf /var/tmp/*
%sudo ALL=(ALL) NOPASSWD: /usr/bin/rm -rf /root/.cache
%sudo ALL=(ALL) NOPASSWD: /usr/bin/find /root -name "*.old" -delete
EOF

# Sudoers file path
SUDOERS_FILE="/etc/sudoers"
SUDOERS_D_DIR="/etc/sudoers.d"
LINUXIFY_SUDOERS="/etc/sudoers.d/linuxify"

echo -e "${GREEN}Step 1: Checking current configuration${NC}"
echo ""

# Check if rules already exist in sudoers
if grep -q "# Linuxify - systemctl commands" "$SUDOERS_FILE"; then
    echo -e "${YELLOW}⚠ Linuxify rules already found in $SUDOERS_FILE${NC}"
    echo "These will be removed and re-added to ensure they're up-to-date."
    echo ""
    
    # Backup original sudoers
    echo -e "${BLUE}Creating backup...${NC}"
    cp "$SUDOERS_FILE" "${SUDOERS_FILE}.backup.linuxify.$(date +%s)"
    echo -e "${GREEN}✓ Backup created${NC}"
    echo ""
    
    # Remove old rules
    echo -e "${BLUE}Removing old Linuxify rules from $SUDOERS_FILE...${NC}"
    sed -i '/# Linuxify - systemctl commands/,/\/usr\/bin\/find \/root -name "\.old" -delete/d' "$SUDOERS_FILE"
    echo -e "${GREEN}✓ Old rules removed${NC}"
    echo ""
fi

# Check if using sudoers.d approach
if [ -d "$SUDOERS_D_DIR" ]; then
    echo -e "${BLUE}Using /etc/sudoers.d/ approach (recommended)${NC}"
    echo ""
    
    # Remove old sudoers.d file if it exists
    if [ -f "$LINUXIFY_SUDOERS" ]; then
        echo -e "${YELLOW}Removing old $LINUXIFY_SUDOERS...${NC}"
        rm -f "$LINUXIFY_SUDOERS"
        echo -e "${GREEN}✓ Old sudoers.d file removed${NC}"
        echo ""
    fi
    
    # Create new sudoers.d file
    echo -e "${BLUE}Creating new sudoers.d file: $LINUXIFY_SUDOERS${NC}"
    
    # Write rules to temporary file first
    TEMP_FILE=$(mktemp)
    echo "$SUDOERS_RULES" > "$TEMP_FILE"
    
    # Validate with visudo
    if visudo -c -f "$TEMP_FILE" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Sudoers syntax valid${NC}"
        
        # Copy to sudoers.d
        cp "$TEMP_FILE" "$LINUXIFY_SUDOERS"
        chmod 0440 "$LINUXIFY_SUDOERS"
        echo -e "${GREEN}✓ Sudoers file created with correct permissions${NC}"
        echo ""
        
        # Final validation
        echo -e "${BLUE}Final validation...${NC}"
        if visudo -c > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Sudoers configuration is valid!${NC}"
            echo ""
            
            # Cleanup
            rm -f "$TEMP_FILE"
            
            # Success
            echo -e "${BOLD}${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
            echo -e "${BOLD}${GREEN}║  ✓ Linuxify sudoers configuration completed successfully!   ║${NC}"
            echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${GREEN}Linuxify can now run the following commands without a password:${NC}"
            echo "  • systemctl (start, stop, enable, disable, restart, reload, mask, unmask)"
            echo "  • apt (clean, autoremove, autoremove --purge)"
            echo "  • journalctl (log cleanup)"
            echo "  • flatpak (remove unused)"
            echo "  • dnf, pacman (package cleanup)"
            echo "  • rm (temp and cache cleanup)"
            echo ""
            exit 0
        else
            echo -e "${RED}✗ Final sudoers validation failed!${NC}"
            echo "Configuration may have issues. Reverting changes..."
            rm -f "$LINUXIFY_SUDOERS" "$TEMP_FILE"
            exit 1
        fi
    else
        echo -e "${RED}✗ Sudoers syntax validation failed!${NC}"
        echo ""
        visudo -c -f "$TEMP_FILE"
        rm -f "$TEMP_FILE"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ /etc/sudoers.d not found, using direct sudoers editing${NC}"
    echo ""
    
    # Backup original sudoers
    echo -e "${BLUE}Creating backup...${NC}"
    cp "$SUDOERS_FILE" "${SUDOERS_FILE}.backup.linuxify.$(date +%s)"
    echo -e "${GREEN}✓ Backup created${NC}"
    echo ""
    
    # Append rules
    echo -e "${BLUE}Adding Linuxify rules to $SUDOERS_FILE...${NC}"
    
    # Create temp file
    TEMP_FILE=$(mktemp)
    cat "$SUDOERS_FILE" > "$TEMP_FILE"
    echo "" >> "$TEMP_FILE"
    echo "$SUDOERS_RULES" >> "$TEMP_FILE"
    
    # Validate with visudo
    if visudo -c -f "$TEMP_FILE" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Sudoers syntax valid${NC}"
        
        # Copy validated file
        cp "$TEMP_FILE" "$SUDOERS_FILE"
        chmod 0440 "$SUDOERS_FILE"
        echo -e "${GREEN}✓ Sudoers file updated with correct permissions${NC}"
        echo ""
        
        # Cleanup
        rm -f "$TEMP_FILE"
        
        # Success
        echo -e "${BOLD}${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${BOLD}${GREEN}║  ✓ Linuxify sudoers configuration completed successfully!   ║${NC}"
        echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${GREEN}Linuxify can now run the following commands without a password:${NC}"
        echo "  • systemctl (start, stop, enable, disable, restart, reload, mask, unmask)"
        echo "  • apt (clean, autoremove, autoremove --purge)"
        echo "  • journalctl (log cleanup)"
        echo "  • flatpak (remove unused)"
        echo "  • dnf, pacman (package cleanup)"
        echo "  • rm (temp and cache cleanup)"
        echo ""
        exit 0
    else
        echo -e "${RED}✗ Sudoers syntax validation failed!${NC}"
        echo ""
        visudo -c -f "$TEMP_FILE"
        echo ""
        echo -e "${YELLOW}Reverting changes...${NC}"
        rm -f "$TEMP_FILE"
        exit 1
    fi
fi
