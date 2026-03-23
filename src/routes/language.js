const express = require('express');
const router = express.Router();
const languageService = require('../services/languageService');
const { asyncHandler } = require('../middlewares/errorHandler');

router.get('/list', asyncHandler(async (req, res) => {
  const languages = await languageService.getLanguageList();
  res.json(languages);
}));

router.get('/:langCode', asyncHandler(async (req, res) => {
  const { langCode } = req.params;
  const languagePack = await languageService.getLanguagePack(langCode);
  res.json(languagePack);
}));

router.get('/status/:langCode', asyncHandler(async (req, res) => {
  const { langCode } = req.params;
  const status = await languageService.getLanguageStatus(langCode);
  res.json(status);
}));

module.exports = router;
