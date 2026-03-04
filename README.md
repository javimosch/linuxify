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

```bash
# Clone or navigate to project
cd linuxify

# Install dependencies
npm install
```

## ⚙️ Sudo Configuration (Optional but Recommended)

To avoid password prompts during system operations:

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

# Linuxify - cleanup commands
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt clean
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt autoremove -y
%sudo ALL=(ALL) NOPASSWD: /usr/bin/journalctl --vacuum-time=7d
%sudo ALL=(ALL) NOPASSWD: /usr/bin/flatpak remove --unused -y
%sudo ALL=(ALL) NOPASSWD: /usr/bin/apt autoremove --purge -y
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

## 🚀 Usage

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Then open: **http://localhost:3000**

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

- [GitHub](https://github.com/yourusername/linuxify)
- [Issues](https://github.com/yourusername/linuxify/issues)
- [Releases](https://github.com/yourusername/linuxify/releases)

---

**Linuxify** - Keep your Linux system optimized, one click at a time.
