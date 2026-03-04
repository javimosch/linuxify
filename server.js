const express = require('express');
const { getServices, toggleService } = require('./modules/services');
const { getExtensions, toggleExtension } = require('./modules/extensions');
const { getSystemInfo, runCleanup, CLEANUP_ACTIONS } = require('./modules/system');

const app = express();
const PORT = 3000;

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
  
  res.render('index', { systemInfo, services, extensions, cleanupActions: CLEANUP_ACTIONS });
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

app.listen(PORT, () => {
  console.log(`Linuxify running at http://localhost:${PORT}`);
});
