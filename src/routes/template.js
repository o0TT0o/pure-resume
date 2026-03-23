const express = require('express');
const router = express.Router();
const templateService = require('../services/templateService');
const { asyncHandler } = require('../middlewares/errorHandler');

router.get('/list', asyncHandler(async (req, res) => {
  const templates = await templateService.getTemplateList();
  res.json(templates);
}));

router.get('/:templateId', asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const template = await templateService.getTemplate(templateId);
  res.json(template);
}));

router.post('/apply/:templateId', asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { data, langCode = 'zh-CN' } = req.body;
  const result = await templateService.applyTemplate(templateId, data, langCode);
  res.json(result);
}));

router.post('/preview/:templateId', asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { data, langCode = 'zh-CN' } = req.body;
  const result = await templateService.applyTemplate(templateId, data, langCode);
  res.set('Content-Type', 'text/html');
  res.send(result.html);
}));

module.exports = router;
