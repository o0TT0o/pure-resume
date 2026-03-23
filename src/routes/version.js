const express = require('express');
const router = express.Router();
const versionService = require('../services/versionService');
const { asyncHandler } = require('../middlewares/errorHandler');

router.post('/snapshot', asyncHandler(async (req, res) => {
  const { langCode, module } = req.body;
  await versionService.saveCurrentVersion(langCode, module);
  res.json({ success: true, message: '版本快照已保存' });
}));

router.post('/compare', asyncHandler(async (req, res) => {
  const { langCode, module, newData } = req.body;
  const result = await versionService.compareVersions(langCode, module, newData);
  res.json(result);
}));

router.get('/list/:langCode/:module', asyncHandler(async (req, res) => {
  const { langCode, module } = req.params;
  const versionsPath = path.join(__dirname, '../../data', langCode, `.${module}.versions.json`);

  try {
    const versions = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
    res.json(versions);
  } catch (error) {
    res.json([]);
  }
}));

module.exports = router;
