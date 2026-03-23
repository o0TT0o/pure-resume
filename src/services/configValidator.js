const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class ConfigValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
    this.schemas = {};
  }

  // 加载所有 Schema
  async loadSchemas() {
    const schemaDir = path.join(__dirname, '../schemas');
    try {
      const schemaFiles = await fs.readdir(schemaDir);

      for (const file of schemaFiles) {
        if (file.endsWith('.schema.json')) {
          const schemaPath = path.join(schemaDir, file);
          const schemaContent = await fs.readFile(schemaPath, 'utf8');
          const schema = JSON.parse(schemaContent);

          // 添加到 Ajv
          const schemaName = file.replace('.schema.json', '');
          this.schemas[schemaName] = this.ajv.compile(schema);
          logger.info(`Schema loaded: ${schemaName}`);
        }
      }
    } catch (error) {
      logger.error('Failed to load schemas:', error);
      throw new Error(`配置Schema加载失败: ${error.message}`);
    }
  }

  // 验证配置文件
  async validateConfig(configPath, schemaName) {
    const schema = this.schemas[schemaName];
    if (!schema) {
      throw new Error(`Schema not found: ${schemaName}`);
    }

    try {
      const configContent = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(configContent);

      const valid = schema(config);

      if (!valid) {
        const errors = schema.errors.map(err => ({
          path: err.instancePath,
          message: err.message,
          params: err.params
        }));

        logger.warn('Config validation failed', {
          configPath,
          schemaName,
          errors
        });

        const { ConfigValidationError } = require('../utils/errors');
        throw new ConfigValidationError(
          `配置验证失败: ${configPath}`,
          errors
        );
      }

      logger.info('Config validation passed', { configPath, schemaName });
      return true;
    } catch (error) {
      if (error.name === 'ConfigValidationError') {
        throw error;
      }
      logger.error('Config validation error:', error);
      throw new Error(`配置文件读取或解析失败: ${error.message}`);
    }
  }

  // 批量验证所有配置
  async validateAllConfigs() {
    const results = [];

    // 验证模块配置
    try {
      await this.validateConfig(
        path.join(__dirname, '../../data/modules/config.json'),
        'modules'
      );
      results.push({ file: 'modules/config.json', status: 'valid' });
    } catch (error) {
      results.push({ file: 'modules/config.json', status: 'invalid', error: error.errors });
    }

    // 验证技能配置
    try {
      await this.validateConfig(
        path.join(__dirname, '../../data/skills/config.json'),
        'skills'
      );
      results.push({ file: 'skills/config.json', status: 'valid' });
    } catch (error) {
      results.push({ file: 'skills/config.json', status: 'invalid', error: error.errors });
    }

    // 验证联系字段配置
    try {
      await this.validateConfig(
        path.join(__dirname, '../../data/personal/fields-config.json'),
        'contact-fields'
      );
      results.push({ file: 'personal/fields-config.json', status: 'valid' });
    } catch (error) {
      results.push({ file: 'personal/fields-config.json', status: 'invalid', error: error.errors });
    }

    // 验证列表配置
    try {
      await this.validateConfig(
        path.join(__dirname, '../../data/lists/config.json'),
        'lists'
      );
      results.push({ file: 'lists/config.json', status: 'valid' });
    } catch (error) {
      results.push({ file: 'lists/config.json', status: 'invalid', error: error.errors });
    }

    return results;
  }
}

module.exports = new ConfigValidator();
