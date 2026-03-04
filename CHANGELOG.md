# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-03-04

### Added

- **Service Management**: Full system service control with 8 logical categories (System Core, User Session, Networking, Audio/Sound, Display/Graphics, Boot/Startup, Virtualization, Development)
- **Critical Service Protection**: Red "CRITICAL" badge prevents accidental disabling of essential system services (systemd, dbus, NetworkManager, gdm, polkit, etc.)
- **GNOME Extensions Management**: Control all installed extensions with categorization (UI Extensions, System Extensions)
- **Real-time System Statistics**: Display uptime, load average, memory usage, CPU count, disk usage, and OS information
- **One-Click Disk Cleanup**: 10 non-destructive cleanup tasks including:
  - Package manager cache (apt, dnf, pacman)
  - Temporary files (/tmp, /var/tmp, ~/.cache)
  - Old logs (systemd journal, syslog)
  - Thumbnail cache
  - Trash bin
  - Broken desktop entries
- **Auto-Refresh**: System statistics and service states refresh every 5 seconds
- **Tabbed Interface**: Single-page application with tabs for Services, Extensions, Disk Cleanup, and Quick Actions
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS + DaisyUI
- **Real-time Feedback**: Visual feedback for service state changes, extension toggles, and cleanup operations
- **API Endpoints**:
  - GET `/api/services` - List all services
  - GET `/api/extensions` - List all extensions
  - GET `/api/system` - Get system information
  - POST `/api/service/:name/:action` - Control services (start/stop/restart/enable/disable)
  - POST `/api/extension/:uuid/toggle` - Toggle extensions on/off
  - POST `/api/cleanup/:task` - Execute cleanup tasks

### Technical Details

- **Backend**: Node.js + Express.js
- **Frontend**: Vue 3 (via CDN), Tailwind CSS + DaisyUI
- **Templating**: EJS
- **Development**: Nodemon for hot-reload during development
- **Security**: Passwordless sudo configuration for service and cleanup commands
- **Architecture**: Modular design with separate modules for services, extensions, and system operations

### Documentation

- Comprehensive README with setup, features, troubleshooting, and API reference
- SETUP.md with detailed sudoers configuration guide
- Landing page (docs/index.html) with project overview and quick start
- Advanced documentation (docs/docs.html) with complete installation and configuration guide

### Initial Release

This is the initial public release of Linuxify, a production-ready Linux system optimizer web application.

---

## Version History

- **v1.0.0** (2025-03-04): Initial public release
