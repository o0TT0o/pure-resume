const express = require('express');
const router = express.Router();
const exportService = require('../services/exportService');
const templateService = require('../services/templateService');
const dataService = require('../services/dataService');
const { asyncHandler } = require('../middlewares/errorHandler');

router.post('/pdf/:templateId', asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { langCode = 'zh-CN' } = req.body;

  const modules = ['personal', 'experience', 'projects', 'education', 'certificates', 'skills'];
  const data = {};

  for (const module of modules) {
    data[module] = await dataService.read(langCode, module);
  }

  const { html } = await templateService.applyTemplate(templateId, data, langCode);
  const pdf = await exportService.exportToPDF(html);

  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `attachment; filename=resume-${templateId}-${langCode}.pdf`);
  res.send(pdf);
}));

router.post('/word/:templateId', asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { langCode = 'zh-CN' } = req.body;

  const modules = ['personal', 'experience', 'projects', 'education', 'certificates', 'skills'];
  const data = {};

  for (const module of modules) {
    data[module] = await dataService.read(langCode, module);
  }

  const { html } = await templateService.applyTemplate(templateId, data, langCode);
  const docx = await exportService.exportToWord(html, langCode);

  res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.set('Content-Disposition', `attachment; filename=resume-${templateId}-${langCode}.docx`);
  res.send(docx);
}));

module.exports = router;
