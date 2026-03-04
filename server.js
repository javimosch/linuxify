const express = require('express');
const { getServices, toggleService } = require('./modules/services');
const { getExtensions, toggleExtension } = require('./modules/extensions');
const { getSystemInfo, runCleanup, CLEANUP_ACTIONS } = require('./modules/system');

const app = express();
const PORT = 3000;

// Detect if running with sudo (elevated privileges)
const RUNNING_WITH_SUDO = process.getuid?.() === 0;
const SUDO_USER = process.env.SUDO_USER || process.env.USER || 'root';

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', async (req, res) => {
  const [systemInfo, services, extensions] = await Promise.all([
    getSystemInfo(),
    getServices(),
    getExtensions()
  ]);
  
  res.render('index', { 
    systemInfo, 
    services, 
    extensions, 
    cleanupActions: CLEANUP_ACTIONS,
    sudoMode: RUNNING_WITH_SUDO,
    sudoUser: SUDO_USER
  });
});

app.post('/api/service/:name', async (req, res) => {
  const { name } = req.params;
  const { action } = req.body;
  const result = await toggleService(name, action);
  res.json(result);
});

app.post('/api/extension/:name', async (req, res) => {
  const { name } = req.params;
  const { action } = req.body;
  const result = await toggleExtension(name, action);
  res.json(result);
});

app.post('/api/cleanup/:actionId', async (req, res) => {
  const { actionId } = req.params;
  const result = await runCleanup(actionId);
  res.json(result);
});

app.get('/api/system', async (req, res) => {
  const systemInfo = await getSystemInfo();
  res.json(systemInfo);
});

// Info endpoint to show current mode
app.get('/api/mode', (req, res) => {
  res.json({
    sudoMode: RUNNING_WITH_SUDO,
    sudoUser: SUDO_USER,
    port: PORT,
    pid: process.pid
  });
});

app.listen(PORT, () => {
  const modeText = RUNNING_WITH_SUDO ? `(sudo mode - user: ${SUDO_USER})` : '(sudoers mode)';
  console.log(`Linuxify running at http://localhost:${PORT} ${modeText}`);
});
