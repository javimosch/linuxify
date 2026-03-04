const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const SERVICE_GROUPS = {
  critical: {
    label: 'Critical System',
    services: [
      'systemd', 'systemd-journald', 'dbus', 'NetworkManager', 'gdm',
      'accounts-daemon', 'polkit', 'cron', 'snapd', 'thermald', 'udisksd',
      'upower', 'fwupd', 'rtkit', 'pipewire', 'pulseaudio', 'colord',
      'wpa_supplicant', 'systemd-logind', 'systemd-resolved'
    ]
  },
  display: {
    label: 'Display & Graphics',
    services: [
      'gdm', 'gnome-shell', 'mutter', 'xorg', 'wayland'
    ]
  },
  hardware: {
    label: 'Hardware',
    services: [
      'thermald', 'power-profiles-daemon', 'smartmontools', 'thermald'
    ]
  },
  network: {
    label: 'Network & Connectivity',
    services: [
      'avahi-daemon', 'bluetooth', 'ModemManager', 'NetworkManager',
      'wpa_supplicant', 'networkd-dispatcher', 'firewalld'
    ]
  },
  printing: {
    label: 'Printing & Scanning',
    services: [
      'cups', 'cups-browsed', 'sane', 'scanner'
    ]
  },
  desktop: {
    label: 'Desktop Features',
    services: [
      'gnome-software', 'gnome-remote-desktop', 'gnome-keyring',
      'flatpak-system-helper', 'packagekit', 'gvfs'
    ]
  },
  background: {
    label: 'Background Services',
    services: [
      'unattended-upgrades', 'fwupd', 'flatpak-system-helper',
      'packagekit', 'akonadi', 'deja-dup'
    ]
  },
  media: {
    label: 'Media',
    services: [
      'pipewire', 'pulseaudio', 'rhythmbox', 'spotify', 'vlc'
    ]
  }
};

const CRITICAL_SERVICES = [
  'systemd', 'dbus', 'NetworkManager', 'gdm', 'accounts-daemon',
  'polkit', 'cron', 'thermald', 'udisks', 'upower', 'wpa',
  'systemd-journald', 'systemd-resolved', 'systemd-logind'
];

function isCritical(name) {
  return CRITICAL_SERVICES.some(c => name.includes(c));
}

function getGroup(name) {
  for (const [key, group] of Object.entries(SERVICE_GROUPS)) {
    if (group.services.some(s => name.includes(s))) {
      return key;
    }
  }
  return 'other';
}

async function getServices() {
  try {
    const { stdout } = await execPromise('systemctl list-units --type=service --state=running --no-pager');
    const running = stdout.split('\n')
      .filter(line => line.includes('.service'))
      .map(line => line.split('.service')[0].trim());
    
    const trackedServices = Object.values(SERVICE_GROUPS).flatMap(g => g.services);
    const uniqueServices = [...new Set([...trackedServices, ...running])];
    
    const services = [];
    
    for (const name of uniqueServices) {
      if (name.includes('.')) continue;
      
      let status = 'unknown';
      let active = false;
      
      try {
        const { stdout: s } = await execPromise(`systemctl is-active ${name} 2>/dev/null`);
        active = s.trim() === 'active';
        status = active ? 'active' : 'inactive';
      } catch (e) {
        status = 'not-found';
      }
      
      services.push({
        name,
        status,
        active,
        critical: isCritical(name),
        group: getGroup(name)
      });
    }
    
    return services.sort((a, b) => {
      if (a.critical !== b.critical) return a.critical ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  } catch (e) {
    return [];
  }
}

async function toggleService(name, action) {
  if (isCritical(name)) {
    return { success: false, error: 'Cannot disable critical service' };
  }
  
  try {
    if (action === 'disable') {
      await execPromise(`sudo systemctl stop ${name} 2>/dev/null`);
      await execPromise(`sudo systemctl disable ${name} 2>/dev/null`);
      await execPromise(`sudo systemctl mask ${name} 2>/dev/null`);
    } else {
      await execPromise(`sudo systemctl unmask ${name} 2>/dev/null`);
      await execPromise(`sudo systemctl enable ${name} 2>/dev/null`);
      await execPromise(`sudo systemctl start ${name} 2>/dev/null`);
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

module.exports = { getServices, toggleService, SERVICE_GROUPS };
