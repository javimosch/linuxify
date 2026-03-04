const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const UI_EXTENSIONS = [
  'blur-my-shell@aunetx',
  'arcmenu@arcmenu.com',
  'dash-to-panel@jderose9.github.com',
  'tiling-assistant@leleat-on-github',
  'openweather-extension@penguin-teal.github.io',
  'mediacontrols@cliffniff.github.com',
  'lockkeys@vaina.lt',
  'noti-bottom-right@anduinos',
  'clipboard-indicator@tudmotu.com'
];

async function getExtensions() {
  try {
    const [allList, enabledList] = await Promise.all([
      execPromise('gnome-extensions list 2>/dev/null'),
      execPromise('gnome-extensions list --enabled 2>/dev/null')
    ]);
    
    const all = allList.stdout.split('\n').filter(e => e.trim());
    const enabled = enabledList.stdout.split('\n').filter(e => e.trim());
    
    const uiExtensions = UI_EXTENSIONS.map(name => ({
      name,
      enabled: enabled.includes(name),
      category: 'ui'
    }));
    
    const otherExtensions = all
      .filter(name => !UI_EXTENSIONS.includes(name))
      .map(name => ({
        name,
        enabled: enabled.includes(name),
        category: 'other'
      }));
    
    return { ui: uiExtensions, other: otherExtensions };
  } catch (e) {
    return { ui: [], other: [] };
  }
}

async function toggleExtension(name, action) {
  try {
    const cmd = action === 'disable' 
      ? `gnome-extensions disable ${name}`
      : `gnome-extensions enable ${name}`;
    
    await execPromise(cmd);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

module.exports = { getExtensions, toggleExtension };
