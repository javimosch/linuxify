# Linux Optimizer WebUI - Setup Guide

## Quick Start

```bash
cd ~/projects/optimize-linux/webui
npm install
npm run dev
```

Visit: `http://localhost:3000`

## Sudo Configuration (No Password Prompts)

To avoid password prompts for systemctl and cleanup commands, add the following to sudoers:

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

Then start with:

```bash
npm run dev
```

## Features

- **System Stats**: Uptime, Load, Memory, CPU, Disk
- **Tabbed Interface**: Services | Extensions | Disk Cleanup | Quick Actions
- **Service Management**: Enable/disable non-critical services (critical protected)
- **Extensions Control**: Toggle UI and system extensions
- **Disk Cleanup**: 10 one-click cleanup actions
- **Auto-refresh**: Updates every 5 seconds

## Commands

- `npm start` - Production mode
- `npm run dev` - Development with auto-reload (nodemon)
