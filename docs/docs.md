# Linux Optimizer WebUI - Setup Guide

## Quick Start

Linuxify supports two different modes of operation. When you first run it, you'll be presented with an interactive setup wizard:

```bash
cd ~/projects/optimize-linux/webui
npm install
npm run dev
```

This will launch the setup wizard where you can choose your preferred mode:

1. **Sudoers Mode** - Configure once, then run as regular user
2. **Sudo Run Mode** - Run directly with `sudo` (auto-restarts)

Visit: `http://localhost:3000`

## Setup Wizard

When you run `npm run dev`, you'll see:

```
🔧 Linux Optimizer WebUI - Setup Wizard

Choose your operating mode:

1) Sudoers Mode
   - Configure sudoers file once
   - Run as regular user with limited sudo scope
   - Password prompts for each operation

2) Sudo Run Mode
   - Run directly with 'sudo'
   - Full root access
   - Will auto-restart with sudo

Enter your choice (1 or 2):
```

### Mode 1: Sudoers Mode (Recommended for Security)

Select option `1` to configure the sudoers file. The app will:
1. Show you a setup script that configures sudoers for Linuxify
2. Run the script automatically (or you can run it manually)
3. Create backups of your original sudoers file
4. Validate the new sudoers configuration

Then start the app as a regular user:

```bash
npm run dev
```

**Advantages:**
- ✅ Most secure - limited sudo scope
- ✅ No password prompts (after configuration)
- ✅ Runs as regular user (safer)
- ✅ Better for multi-user systems

**Setup (detailed):**

To manually configure sudoers for Mode 1:

```bash
sudo visudo
```

Add these lines at the end:

```sudoers
# Linux Optimizer - systemctl commands
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl disable *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl stop *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl mask *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl unmask *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl enable *
%sudo ALL=(ALL) NOPASSWD: /bin/systemctl start *

# Linux Optimizer - cleanup commands
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt clean
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt autoremove -y
%sudo ALL=(ALL) NOPASSWD: /usr/bin/journalctl --vacuum-time=7d
%sudo ALL=(ALL) NOPASSWD: /usr/bin/flatpak remove --unused -y
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt autoremove --purge -y
```

Then start:

```bash
npm run dev
```

### Mode 2: Sudo Run Mode (Simplest Setup)

Select option `2` to run directly with sudo. The app will:
1. Automatically restart itself with `sudo`
2. Show your sudo password prompt
3. Run with full root access

**Advantages:**
- ✅ Simplest setup - no configuration needed
- ✅ Automatic - no manual setup steps
- ✅ Full root access for all operations
- ✅ No password prompts during operation

**Disadvantages:**
- ⚠️ Runs as root (less secure)
- ⚠️ Security warning displayed in UI
- ⚠️ Not recommended for production

**How it works:**

When you select Mode 2, the app automatically restarts with `sudo` and remembers your choice. A security warning banner appears in the UI to remind you it's running as root.

**Troubleshooting Sudo Run Mode:**

If you have Node.js installed via NVM, Homebrew, or other version managers:

1. **Option 1** - Use the bash wrapper (automatic):
   ```bash
   ./bin/linuxify.sh
   ```

2. **Option 2** - Explicit PATH preservation:
   ```bash
   sudo PATH=$PATH npm run dev
   ```

3. **Option 3** - Direct node call:
   ```bash
   sudo /path/to/node npm run dev
   ```

The app will try these methods automatically. If none work, it will show you the fallback commands to try.

## Features

- **System Stats**: Uptime, Load, Memory, CPU, Disk
- **Tabbed Interface**: Services | Extensions | Disk Cleanup | Quick Actions
- **Service Management**: Enable/disable non-critical services (critical protected)
- **Extensions Control**: Toggle UI and system extensions
- **Disk Cleanup**: 10 one-click cleanup actions
- **Auto-refresh**: Updates every 5 seconds
- **Dual-mode Operation**: Choose between sudoers (secure) or sudo-run (simple) mode

## Commands

- `npm start` - Production mode
- `npm run dev` - Development with auto-reload (setup wizard + auto-reload)
- `npm run dev -- --skip-setup` - Skip setup wizard, start directly

## Mode Comparison

| Feature | Sudoers Mode | Sudo Run Mode |
|---------|--------------|---------------|
| Setup Time | ~2 minutes | Instant |
| Security | Higher | Lower (runs as root) |
| Password Prompts | None (after setup) | None |
| Multi-user Safe | Yes | No |
| Requires Configuration | Yes | No |
| Recommended | ✅ Yes | For testing only |

## Changing Modes

To change your operating mode later:

1. Delete your mode preference: `rm ~/.linuxify-mode` (if file exists)
2. Run the setup wizard again: `npm run dev`
3. Choose your new mode

## Security Considerations

### Sudoers Mode (Recommended)

- ✅ Runs as regular user
- ✅ Limited sudo scope to specific commands
- ✅ Audit trail in sudoers file
- ✅ Best for multi-user systems
- ✅ Original sudoers backed up automatically

### Sudo Run Mode

- ⚠️ Runs with full root access
- ⚠️ No command restrictions
- ⚠️ Security warning banner displayed
- ⚠️ Best for development/testing only

**Recommendation:** Use Sudoers Mode in production environments.

## Troubleshooting

### Setup Wizard Not Showing

If you skipped the wizard, run:

```bash
npm run dev
```

### Sudo Password Prompt Issues (Mode 1)

If you're still getting password prompts in Sudoers Mode, verify the sudoers configuration:

```bash
sudo visudo -c
```

And check that your user is in the `sudo` group:

```bash
groups $USER
```

### Node Not Found When Using Sudo (Mode 2)

If you see "node: command not found" errors:

1. Try the bash wrapper:
   ```bash
   ./bin/linuxify.sh
   ```

2. Or use explicit PATH:
   ```bash
   sudo PATH=$PATH npm run dev
   ```

3. Or find your node path:
   ```bash
   which node
   sudo /path/to/node npm run dev
   ```

### Port 3000 Already in Use

Change the port in package.json or:

```bash
PORT=3001 npm run dev
```

## Development

- **Auto-reload**: Changes to files trigger automatic server restart
- **Live Mode Detection**: `/api/mode` endpoint shows current operating mode
- **Debug Mode**: Set `DEBUG=*` for verbose output

```bash
DEBUG=* npm run dev
```

## Uninstalling

To completely remove Linuxify:

```bash
# Remove sudoers configuration (if using Mode 1)
sudo visudo  # Remove the Linuxify section manually

# Or restore from backup (created automatically during setup)
sudo cp /etc/sudoers.bak /etc/sudoers

# Remove the application
rm -rf ~/projects/optimize-linux/webui
```

## Additional Resources

See `README.md` for more information about dual-mode architecture and security considerations.
