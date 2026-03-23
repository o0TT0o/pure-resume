const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const versionService = require('../services/versionService');
const { asyncHandler } = require('../middlewares/errorHandler');

// 符合设计文档：GET /api/data/:lang/:module - 获取指定语言的简历数据
router.get('/:langCode/:module', asyncHandler(async (req, res) => {
  const { langCode, module } = req.params;
  const data = await dataService.read(langCode, module);
  res.json(data);
}));

// 符合设计文档：POST /api/data/:lang/:module - 保存指定语言的简历数据
router.post('/:langCode/:module', asyncHandler(async (req, res) => {
  const { langCode, module } = req.params;
  const data = req.body;

  await versionService.saveCurrentVersion(langCode, module);
  await dataService.write(langCode, module, data);

  res.json({ success: true, message: '数据保存成功' });
}));

// 符合设计文档：PUT /api/data/:lang/:module/:id - 更新单条记录
router.put('/:langCode/:module/:id', asyncHandler(async (req, res) => {
  const { langCode, module, id } = req.params;
  const updates = req.body;

  const updatedRecord = await dataService.updateRecord(langCode, module, id, updates);

  res.json({ 
    success: true, 
    message: '记录更新成功',
    data: updatedRecord
  });
}));

// 符合设计文档：DELETE /api/data/:lang/:module/:id - 删除单条记录
router.delete('/:langCode/:module/:id', asyncHandler(async (req, res) => {
  const { langCode, module, id } = req.params;

  const deletedRecord = await dataService.deleteRecord(langCode, module, id);

  res.json({ 
    success: true, 
    message: '记录删除成功',
    data: deletedRecord
  });
}));

// 配置文件管理
router.get('/config/:filename', asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const data = await dataService.readConfig(filename);
  res.json(data);
}));

router.post('/config/:filename', asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const data = req.body;
  await dataService.writeConfig(filename, data);
  res.json({ success: true, message: '配置保存成功' });
}));

module.exports = router;
