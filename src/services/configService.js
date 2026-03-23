const fs = require('fs').promises;
const path = require('path');

const CONFIG_DIR = path.join(__dirname, '../../data');

class ConfigService {
  constructor() {
    this.modulesConfig = null;
    this.skillsConfig = null;
    this.contactFieldsConfig = null;
    this.dateFormatsConfig = null;
    this.listsConfig = null;
  }

  async init() {
    await this.loadAllConfigs();
  }

  async loadAllConfigs() {
    try {
      const [modules, skills, contactFields, dateFormats, lists] = await Promise.all([
        this.loadModulesConfig(),
        this.loadSkillsConfig(),
        this.loadContactFieldsConfig(),
        this.loadDateFormatsConfig(),
        this.loadListsConfig()
      ]);

      this.modulesConfig = modules;
      this.skillsConfig = skills;
      this.contactFieldsConfig = contactFields;
      this.dateFormatsConfig = dateFormats;
      this.listsConfig = lists;

      console.log('所有配置加载成功');
    } catch (error) {
      console.error('配置加载失败:', error);
      throw error;
    }
  }

  async loadModulesConfig() {
    const configPath = path.join(CONFIG_DIR, 'modules', 'config.json');
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  }

  async getModulesConfig() {
    if (!this.modulesConfig) {
      await this.loadModulesConfig();
    }
    return this.modulesConfig;
  }

  async getModuleConfig(moduleId) {
    const config = await this.getModulesConfig();
    return config[moduleId];
  }

  async getModuleIds() {
    const config = await this.getModulesConfig();
    return Object.keys(config);
  }

  async hasModule(moduleId) {
    const config = await this.getModulesConfig();
    return moduleId in config;
  }

  async loadSkillsConfig() {
    const configPath = path.join(CONFIG_DIR, 'skills', 'config.json');
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  }

  async getSkillsConfig() {
    if (!this.skillsConfig) {
      await this.loadSkillsConfig();
    }
    return this.skillsConfig;
  }

  async getSkillCategories() {
    const config = await this.getSkillsConfig();
    return config.categories || [];
  }

  async getSkillCategoryById(categoryId) {
    const categories = await this.getSkillCategories();
    return categories.find(cat => cat.id === categoryId);
  }

  async loadContactFieldsConfig() {
    const configPath = path.join(CONFIG_DIR, 'personal', 'fields-config.json');
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  }

  async getContactFieldsConfig() {
    if (!this.contactFieldsConfig) {
      await this.loadContactFieldsConfig();
    }
    return this.contactFieldsConfig;
  }

  async getContactFields() {
    const config = await this.getContactFieldsConfig();
    return config.contactFields || [];
  }

  async loadDateFormatsConfig() {
    const configPath = path.join(CONFIG_DIR, 'date-formats', 'config.json');
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  }

  async getDateFormatsConfig() {
    if (!this.dateFormatsConfig) {
      await this.loadDateFormatsConfig();
    }
    return this.dateFormatsConfig;
  }

  async getDateFormat(langCode) {
    const config = await this.getDateFormatsConfig();
    return config.formats[langCode] || config.formats['en-US'];
  }

  async loadListsConfig() {
    const configPath = path.join(CONFIG_DIR, 'lists', 'config.json');
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  }

  async getListsConfig() {
    if (!this.listsConfig) {
      await this.loadListsConfig();
    }
    return this.listsConfig;
  }

  async getListConfig(listType) {
    const config = await this.getListsConfig();
    return config.listTypes[listType];
  }

  async generateValidationRules(moduleId) {
    const listConfig = await this.getListConfig(moduleId);
    const rules = {};

    if (listConfig && listConfig.fields) {
      listConfig.fields.forEach(field => {
        rules[field.id] = {};
        if (field.required) {
          rules[field.id].required = true;
        }
        if (field.type === 'email') {
          rules[field.id].email = true;
        }
        if (field.type === 'url') {
          rules[field.id].url = true;
        }
        if (field.type === 'tel') {
          rules[field.id].pattern = /^[\d\s\-\+\(\)]+$/;
        }
      });
    }

    return rules;
  }

  async generateFormHTML(moduleId) {
    const listConfig = await this.getListConfig(moduleId);
    if (!listConfig || !listConfig.fields) {
      return '';
    }

    return listConfig.fields.map(field => {
      const requiredAttr = field.required ? 'required' : '';
      const requiredLabel = field.required ? '<span class="required">*</span>' : '';

      let inputHTML = '';
      switch (field.type) {
        case 'textarea':
          inputHTML = `<textarea name="${field.id}" ${requiredAttr}></textarea>`;
          break;
        case 'date':
          inputHTML = `<input type="month" name="${field.id}" ${requiredAttr}>`;
          break;
        case 'array':
          inputHTML = `<input type="text" name="${field.id}" multiple>`;
          break;
        default:
          inputHTML = `<input type="${field.type}" name="${field.id}" ${requiredAttr}>`;
      }

      return `
        <div class="form-field">
          <label>${field.name} ${requiredLabel}</label>
          ${inputHTML}
        </div>
      `;
    }).join('');
  }

  async reloadConfig(configType) {
    switch (configType) {
      case 'modules':
        this.modulesConfig = await this.loadModulesConfig();
        break;
      case 'skills':
        this.skillsConfig = await this.loadSkillsConfig();
        break;
      case 'contact-fields':
        this.contactFieldsConfig = await this.loadContactFieldsConfig();
        break;
      case 'date-formats':
        this.dateFormatsConfig = await this.loadDateFormatsConfig();
        break;
      case 'lists':
        this.listsConfig = await this.loadListsConfig();
        break;
      default:
        await this.loadAllConfigs();
    }
  }

  async loadConfigI18n(langCode) {
    const i18nPath = path.join(__dirname, '../../languages', langCode, 'config-i18n.json');
    try {
      const data = await fs.readFile(i18nPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      const defaultPath = path.join(__dirname, '../../languages/zh-CN/config-i18n.json');
      const data = await fs.readFile(defaultPath, 'utf8');
      return JSON.parse(data);
    }
  }

  async getModulesConfigWithI18n(langCode) {
    const config = await this.getModulesConfig();
    const i18nConfig = await this.loadConfigI18n(langCode);

    return Object.keys(config).map(moduleId => ({
      ...config[moduleId],
      name: i18nConfig.module[moduleId] || config[moduleId].i18nKey
    }));
  }

  async getSkillCategoriesWithI18n(langCode) {
    const config = await this.getSkillsConfig();
    const i18nConfig = await this.loadConfigI18n(langCode);

    return config.categories.map(category => ({
      ...category,
      name: i18nConfig.skills[category.id] || category.i18nKey
    }));
  }

  async getContactFieldsWithI18n(langCode) {
    const config = await this.getContactFieldsConfig();
    const i18nConfig = await this.loadConfigI18n(langCode);

    return config.contactFields.map(field => {
      const fieldI18n = i18nConfig.contact[field.id] || {};
      return {
        ...field,
        name: fieldI18n.name || field.i18nKey,
        placeholder: fieldI18n.placeholder || ''
      };
    });
  }

  async getListConfigWithI18n(listType, langCode) {
    const config = await this.getListConfig(listType);
    const i18nConfig = await this.loadConfigI18n(langCode);

    const listI18n = i18nConfig.list[listType] || {};

    return {
      ...config,
      name: listI18n.name || config.i18nKey,
      fields: config.fields.map(field => ({
        ...field,
        name: listI18n.field?.[field.id] || field.i18nKey
      }))
    };
  }
}

module.exports = new ConfigService();
