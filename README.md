# Linuxify

> Lightweight Linux system optimizer - manage services, extensions, and disk space with an intuitive web UI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org)

## 🚀 Features

- **Service Management** - Enable/disable non-critical system services
- **Extension Control** - Manage GNOME shell extensions (UI + system)
- **Disk Cleanup** - One-click cleanup tasks (APT cache, thumbnails, logs, etc.)
- **Real-time Monitoring** - Live system stats (uptime, load, memory, CPU, disk)
- **Critical Protection** - Cannot disable critical system services
- **Tabbed Interface** - Single-page layout prevents scroll conflicts
- **Auto-refresh** - Updates every 5 seconds
- **Responsive Design** - Works on desktop and mobile

## 📋 Requirements

- Linux (Ubuntu, Debian, AnduinOS, etc.)
- Node.js >= 16
- npm or yarn
- sudo access (for system operations)

## 🔧 Installation

### Quick Start (Recommended)

The easiest way to get started with Linuxify is using `npx`:

```bash
npx linuxify
```

This will:
1. Show an interactive setup wizard to choose your preferred setup mode
2. Configure either sudoers or run directly with sudo
3. Start the application automatically

### Installation Options

Two setup modes are available. The setup wizard will guide you through both options:

#### 1. **Sudoers Mode** (Recommended for security-conscious users)
```bash
npx linuxify
# Select option "1" when prompted
```
- ✅ Configure sudoers file once during setup
- ✅ Run Linuxify as regular user afterwards
- ✅ Commands execute with limited, scoped sudo permissions
- ⚠️ Requires understanding of sudoers configuration
- ⚠️ Exposes commands to sudoers file (potential privilege escalation vector if other apps exploit sudoers)

#### 2. **Sudo Run Mode** (Simpler, full control)
```bash
sudo npx linuxify
# Or select option "2" when prompted for sudo-run instructions
```
- ✅ No sudoers configuration needed
- ✅ Simplest setup (just one command with sudo)
- ✅ Full root privileges, complete control
- ⚠️ Web interface runs as root (security consideration)
- ⚠️ Should only be accessed from localhost
- ⚠️ Should not be exposed to network/internet

#### 3. **Skip Setup** (Manual configuration later)
```bash
npx linuxify
# Select option "0" when prompted
```
- Run without any setup
- Configure manually later with `npx linuxify --setup` or `sudo bash setup.sh`

### Manual Installation

```bash
# Clone or navigate to project
cd linuxify

# Install dependencies
npm install

# Start with setup wizard
npm run cli

# Or start directly (skip setup)
npm start
```

## ⚙️ Sudo Configuration

### Automatic Setup (Recommended)

When you run `npx linuxify`, the interactive setup wizard will:

1. Display the required sudoers rules
2. **Automatically edit the sudoers file** (just enter your sudo password)
3. Verify the configuration with validation
4. Test if passwordless sudo is working

**No manual editing needed!** The wizard uses a secure bash script that:
- Validates sudoers syntax before applying changes
- Creates backups of your sudoers file
- Uses `/etc/sudoers.d/linuxify` when available (safer approach)
- Falls back to direct editing only if needed
- Shows clear success/error messages

### Manual Setup (Alternative)

If you prefer manual setup:

```bash
sudo bash setup.sh
```

Or for interactive sudoers editing:

```bash
sudo visudo
```

Add at the end of the file:

```sudoers
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
```

This is the same configuration that gets applied automatically by `setup.sh`.

**To verify sudoers was applied correctly:**
```bash
sudo -n systemctl status systemd
```

If this runs without asking for a password, sudoers is configured correctly!

## 🚀 Usage

### Using npx (Easiest)

```bash
# Run with interactive setup wizard
npx linuxify

# Skip setup and start directly
npx linuxify --skip-setup

# View all options
npx linuxify --help
```

### Using npm scripts

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Run CLI with setup wizard
npm run cli
```

Then open your browser to: **http://localhost:3000**

### CLI Options

```bash
npx linuxify [options]

Options:
  --setup, -s       Run setup wizard before starting
  --skip-setup      Skip setup and start directly
  --help, -h        Show help message
  --version, -v     Show version number

Examples:
  npx linuxify                 # Interactive setup then start
  npx linuxify --skip-setup    # Start without setup
  npx linuxify --help          # Show this help
```

### Standalone Setup Script

If you only want to configure sudoers without starting the app:

```bash
sudo bash setup.sh
```

This script:
- ✓ Validates sudoers syntax before applying
- ✓ Creates automatic backups
- ✓ Prefers `/etc/sudoers.d/linuxify` for safer configuration
- ✓ Verifies the final configuration
- ✓ Shows clear success/error messages
- ✓ Handles both systemctl and cleanup commands

## 📊 Tabs Overview

### Services
- **Optimizable** - Non-critical services you can safely disable
- **All Services** - Complete system services list
- Critical services are protected (cannot be disabled)

### Extensions
- **UI Extensions** - GNOME shell cosmetic/UI extensions (heavy hitters like blur-my-shell, arcmenu)
- **Other Extensions** - System extensions (keyboard layout, keyboard indicators)

### Disk Cleanup
One-click cleanup actions:
- APT cache & autoremove
- Desktop thumbnails & trash
- NPM, Yarn, Pip caches
- Flatpak unused packages
- Journal logs (7+ days)
- Old kernels

### Quick Actions
- Disable all UI extensions (preserves dash-to-panel)
- Force refresh system data

## 🎯 System Stats

Real-time display of:
- **Uptime** - System uptime duration
- **Load Average** - CPU load (color-coded: green < 0.5, yellow < 1.0, red > 1.0)
- **Memory** - Used / Total RAM
- **CPU** - Processor model
- **Disk** - Available / Total / Used space

## 🏗️ Architecture

```
linuxify/
├── server.js              # Express server
├── package.json          # Dependencies
├── modules/
│   ├── services.js       # Service management
│   ├── extensions.js     # GNOME extension control
│   └── system.js         # System info & cleanup
├── views/
│   └── index.ejs         # Main UI (Vue 3)
├── docs/
│   ├── index.html        # Landing page
│   └── docs.html         # Advanced documentation
└── README.md             # This file
```

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vue 3 (CDN) + EJS templates
- **Styling**: Tailwind CSS + DaisyUI
- **Task Runner**: npm scripts + nodemon

## 📝 Configuration

Edit `server.js` to change:
- Port: `const PORT = 3000;` (line 7)
- Refresh interval: `setInterval(refresh, 5000);` (line 338 in index.ejs)

## ⚠️ Safety Considerations

- **Critical Services** - Marked red, cannot be toggled
- **Non-critical Only** - Services tab filters by default to safe options
- **Cleanup Tasks** - All non-destructive, safe to run multiple times
- **Read-only Operations** - Monitoring and info gathering don't modify system

## 🐛 Troubleshooting

### "sudo: no password provided"
Run through sudoers configuration above to allow passwordless sudo for specific commands.

### Port 3000 already in use
Change PORT in server.js or kill existing process:
```bash
fuser -k 3000/tcp
```

### Extensions not showing
Some extensions may be installed in system directories. Refresh browser cache.

### Disk cleanup not freeing space
Some services may lock files. Try one task at a time and wait a moment.

## 📄 License

MIT - See LICENSE file

## 👤 Author

**arancibiajav@gmail.com**

## 🤝 Contributing

Contributions welcome! Feel free to open issues and pull requests.

## 🔗 Links

- [GitHub](https://github.com/javimosch/linuxify)
- [Issues](https://github.com/javimosch/linuxify/issues)
- [Releases](https://github.com/javimosch/linuxify/releases)

---

**Linuxify** - Keep your Linux system optimized, one click at a time.
