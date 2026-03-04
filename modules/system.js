const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const CLEANUP_ACTIONS = [
  { id: 'apt-clean', name: 'APT Cache Clean', command: 'sudo apt clean', critical: false },
  { id: 'apt-autoremove', name: 'APT Autoremove', command: 'sudo apt autoremove -y', critical: false },
  { id: 'thumbnails', name: 'Clear Thumbnails', command: 'rm -rf ~/.cache/thumbnails/*', critical: false },
  { id: 'trash', name: 'Empty Trash', command: 'rm -rf ~/.local/share/Trash/*', critical: false },
  { id: 'npm-cache', name: 'Clear NPM Cache', command: 'npm cache clean --force', critical: false },
  { id: 'yarn-cache', name: 'Clear Yarn Cache', command: 'yarn cache clean', critical: false },
  { id: 'pip-cache', name: 'Clear Pip Cache', command: 'pip cache purge 2>/dev/null || true', critical: false },
  { id: 'flatpak-cache', name: 'Clear Flatpak Cache', command: 'flatpak remove --unused -y', critical: false },
  { id: 'journal-clean', name: 'Clean Journal Logs', command: 'sudo journalctl --vacuum-time=7d', critical: false },
  { id: 'old-kernels', name: 'Remove Old Kernels', command: 'sudo apt autoremove --purge -y 2>/dev/null || true', critical: false }
];

async function getSystemInfo() {
  try {
    const [uptime, mem, load, cpu, distro, disk] = await Promise.all([
      execPromise('uptime -p'),
      execPromise('free -h --si'),
      execPromise('uptime'),
      execPromise("lscpu | grep 'Model name' | head -1 | cut -d: -f2"),
      execPromise('cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d \\"'),
      execPromise('df -h / | tail -1')
    ]);
    
    const loadMatch = load.stdout.match(/load average: ([\d.,]+)/);
    
    const memLines = mem.stdout.split('\n');
    let memUsed = 'N/A';
    let memTotal = 'N/A';
    for (const line of memLines) {
      const match = line.match(/^Mem:\s+(\d+\.?\d*[GMK]?)\s+(\d+\.?\d*[GMK]?)/);
      if (match) {
        memTotal = match[1];
        memUsed = match[2];
        break;
      }
    }
    
    const diskMatch = disk.stdout.trim().split(/\s+/);
    const diskTotal = diskMatch[1] || 'N/A';
    const diskUsed = diskMatch[2] || 'N/A';
    const diskAvail = diskMatch[3] || 'N/A';
    const diskUse = diskMatch[4] || 'N/A';
    
    return {
      uptime: uptime.stdout.trim(),
      load: loadMatch ? loadMatch[1].split(',')[0] : 'N/A',
      memory: `${memUsed} / ${memTotal}`,
      cpu: (cpu.stdout.trim() || 'Unknown').replace(/^\s+/, ''),
      distro: distro.stdout.trim() || 'Unknown Linux',
      disk: {
        total: diskTotal,
        used: diskUsed,
        available: diskAvail,
        usePercent: diskUse
      }
    };
  } catch (e) {
    return { 
      uptime: 'N/A', load: 'N/A', memory: 'N/A', cpu: 'Unknown',
      distro: 'Unknown Linux',
      disk: { total: 'N/A', used: 'N/A', available: 'N/A', usePercent: 'N/A' }
    };
  }
}

async function runCleanup(actionId) {
  const action = CLEANUP_ACTIONS.find(a => a.id === actionId);
  if (!action) {
    return { success: false, error: 'Unknown action' };
  }
  
  try {
    await execPromise(action.command);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

module.exports = { getSystemInfo, runCleanup, CLEANUP_ACTIONS };
