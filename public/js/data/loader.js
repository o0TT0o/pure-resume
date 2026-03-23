// ==================== 数据加载 ====================

import {
  currentLang,
  modulesConfig
} from '../core/state.js';
import {
  setResumeDataModule,
  setSkillsConfig,
  setContactFieldsConfig,
  setListConfig
} from '../core/state.js';

// 加载简历数据
export async function loadResumeData() {
  try {
    const modules = modulesConfig.map(m => m.id);

    for (const module of modules) {
      const response = await fetch(`/api/data/${currentLang}/${module}`);
      if (response.ok) {
        setResumeDataModule(module, await response.json());
      } else {
        setResumeDataModule(module, module === 'personal' ? {} : []);
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

// 获取联系字段配置
export async function getContactFields() {
  try {
    const response = await fetch(`/api/config/contact-fields/i18n/${currentLang}`);
    const fields = await response.json();
    const result = Array.isArray(fields) ? fields : (fields.contactFields || []);
    setContactFieldsConfig(result);
    return result;
  } catch (error) {
    console.error('获取联系字段失败:', error);
    return [];
  }
}

// 获取技能分类配置
export async function getSkillCategories() {
  try {
    const response = await fetch(`/api/config/skills/i18n/${currentLang}`);
    const categories = await response.json();
    const result = Array.isArray(categories) ? categories : (categories.categories || []);
    setSkillsConfig(result);
    return result;
  } catch (error) {
    console.error('获取技能分类失败:', error);
    return [];
  }
}

// 获取列表配置
export async function getListConfig(listType) {
  try {
    const { listConfigs } = await import('../core/state.js');
    if (listConfigs[listType]) {
      return listConfigs[listType];
    }
    const response = await fetch(`/api/config/lists/${listType}/i18n/${currentLang}`);
    const config = await response.json();
    setListConfig(listType, config);
    return config;
  } catch (error) {
    console.error('获取列表配置失败:', error);
    return { name: listType, fields: [] };
  }
}
