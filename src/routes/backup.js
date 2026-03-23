const express = require('express');
const router = express.Router();
const backupService = require('../services/backupService');
const { asyncHandler } = require('../middlewares/errorHandler');

router.post('/create', asyncHandler(async (req, res) => {
  const backupPath = await backupService.createBackup();
  res.json({ success: true, message: '备份创建成功', backupPath });
}));

router.get('/list', asyncHandler(async (req, res) => {
  const backups = await backupService.listBackups();
  res.json(backups);
}));

router.delete('/:filename', asyncHandler(async (req, res) => {
  const { filename } = req.params;
  await backupService.deleteBackup(filename);
  res.json({ success: true, message: '备份删除成功' });
}));

router.post('/restore/:filename', asyncHandler(async (req, res) => {
  const { filename } = req.params;
  await backupService.restoreBackup(filename);
  res.json({ success: true, message: '备份恢复成功' });
}));

module.exports = router;
