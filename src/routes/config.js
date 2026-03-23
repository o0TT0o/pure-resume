const express = require('express');
const router = express.Router();
const configService = require('../services/configService');
const configValidator = require('../services/configValidator');
const { asyncHandler } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

async function initializeConfig() {
  try {
    await configService.init();
    await configValidator.loadSchemas();

    const validationResults = await configValidator.validateAllConfigs();
    const hasErrors = validationResults.some(r => r.status === 'invalid');

    if (hasErrors) {
      logger.error('Configuration validation failed at startup:', validationResults);
      throw new Error('配置文件验证失败，请检查配置');
    }

    logger.info('All configurations validated successfully');
  } catch (error) {
    logger.error('Configuration initialization failed:', error);
    throw error;
  }
}

initializeConfig().catch(err => {
  logger.error('Failed to initialize configuration:', err);
  process.exit(1);
});

router.get('/modules', asyncHandler(async (req, res) => {
  const config = await configService.getModulesConfig();
  res.json(config);
}));

router.get('/modules/:moduleId', asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const config = await configService.getModuleConfig(moduleId);

  if (!config) {
    return res.status(404).json({
      error: {
        code: 'MODULE_NOT_FOUND',
        message: `模块不存在: ${moduleId}`,
        timestamp: new Date().toISOString()
      }
    });
  }

  res.json(config);
}));

router.get('/modules/list', asyncHandler(async (req, res) => {
  const moduleIds = await configService.getModuleIds();
  res.json(moduleIds);
}));

router.get('/skills', asyncHandler(async (req, res) => {
  const config = await configService.getSkillsConfig();
  res.json(config);
}));

router.get('/skills/categories', asyncHandler(async (req, res) => {
  const categories = await configService.getSkillCategories();
  res.json(categories);
}));

router.get('/contact-fields', asyncHandler(async (req, res) => {
  const config = await configService.getContactFieldsConfig();
  res.json(config);
}));

router.get('/date-formats', asyncHandler(async (req, res) => {
  const config = await configService.getDateFormatsConfig();
  res.json(config);
}));

router.get('/date-formats/:langCode', asyncHandler(async (req, res) => {
  const { langCode } = req.params;
  const format = await configService.getDateFormat(langCode);
  res.json(format);
}));

router.get('/lists', asyncHandler(async (req, res) => {
  const config = await configService.getListsConfig();
  res.json(config);
}));

router.get('/lists/:listType', asyncHandler(async (req, res) => {
  const { listType } = req.params;
  const config = await configService.getListConfig(listType);

  if (!config) {
    return res.status(404).json({
      error: {
        code: 'LIST_TYPE_NOT_FOUND',
        message: `列表类型不存在: ${listType}`,
        timestamp: new Date().toISOString()
      }
    });
  }

  res.json(config);
}));

router.get('/validation-rules/:moduleId', asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const rules = await configService.generateValidationRules(moduleId);
  res.json(rules);
}));

router.get('/modules/i18n/:langCode', asyncHandler(async (req, res) => {
  const { langCode } = req.params;
  const config = await configService.getModulesConfigWithI18n(langCode);
  res.json(config);
}));

router.get('/skills/i18n/:langCode', asyncHandler(async (req, res) => {
  const { langCode } = req.params;
  const categories = await configService.getSkillCategoriesWithI18n(langCode);
  res.json(categories);
}));

router.get('/contact-fields/i18n/:langCode', asyncHandler(async (req, res) => {
  const { langCode } = req.params;
  const fields = await configService.getContactFieldsWithI18n(langCode);
  res.json(fields);
}));

router.get('/lists/:listType/i18n/:langCode', asyncHandler(async (req, res) => {
  const { listType, langCode } = req.params;
  const config = await configService.getListConfigWithI18n(listType, langCode);
  res.json(config);
}));

module.exports = router;
