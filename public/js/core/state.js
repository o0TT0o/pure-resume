// ==================== 全局状态 ====================

let currentLang = 'zh-CN';
let currentTemplate = 'boss-zhipian';
let currentModule = 'personal';
let resumeData = {};
let modulesConfig = [];
let skillsConfig = [];
let contactFieldsConfig = [];
let listConfigs = {};
let uiI18n = {};
let configI18n = {};
let originalData = {};
let isEditMode = false; // 是否为管理员编辑模式

function setLang(lang) {
  currentLang = lang;
}

function setTemplate(template) {
  currentTemplate = template;
}

function setModule(module) {
  currentModule = module;
}

function setResumeData(data) {
  resumeData = data;
}

function setModulesConfig(config) {
  modulesConfig = config;
}

function setSkillsConfig(config) {
  skillsConfig = config;
}

function setContactFieldsConfig(config) {
  contactFieldsConfig = config;
}

function setListConfig(type, config) {
  listConfigs[type] = config;
}

function clearListConfigs() {
  listConfigs = {};
}

function setUiI18n(i18n) {
  uiI18n = i18n;
}

function setConfigI18n(i18n) {
  configI18n = i18n;
}

function setOriginalData(module, data) {
  originalData[module] = data;
}

function setEditMode(mode) {
  isEditMode = mode;
}

// 检查是否有未保存的更改
function hasUnsavedChanges() {
  const currentData = resumeData[currentModule] || {};
  const originalModuleData = originalData[currentModule] || {};
  return JSON.stringify(currentData) !== JSON.stringify(originalModuleData);
}

function setResumeDataModule(module, data) {
  resumeData[module] = data;
}

function setResumeDataSkillsCategory(category, data) {
  if (!resumeData.skills) {
    resumeData.skills = {};
  }
  resumeData.skills[category] = data;
}

function updateResumeDataField(module, field, value) {
  resumeData[module][field] = value;
}

function updateResumeDataListItem(module, index, field, value) {
  resumeData[module][index][field] = value;
}

function updateResumeDataSkillsItem(category, index, field, value) {
  resumeData.skills[category][index][field] = value;
}

function updateResumeDataSkillsSoft(index, value) {
  resumeData.skills.soft[index] = value;
}

function pushResumeDataModuleItem(module, item) {
  if (!resumeData[module]) {
    resumeData[module] = [];
  }
  resumeData[module].push(item);
}

function deleteResumeDataModuleItem(module, index) {
  if (resumeData[module]) {
    resumeData[module].splice(index, 1);
  }
}

function pushResumeDataSkillsItem(category, item) {
  if (!resumeData.skills) {
    resumeData.skills = {};
  }
  if (!resumeData.skills[category]) {
    resumeData.skills[category] = [];
  }
  resumeData.skills[category].push(item);
}

function deleteResumeDataSkillsItem(category, index) {
  if (resumeData.skills && resumeData.skills[category]) {
    resumeData.skills[category].splice(index, 1);
  }
}

function deleteResumeDataSkillsSoftItem(index) {
  if (resumeData.skills && resumeData.skills.soft) {
    resumeData.skills.soft.splice(index, 1);
  }
}

export {
  currentLang,
  currentTemplate,
  currentModule,
  resumeData,
  modulesConfig,
  skillsConfig,
  contactFieldsConfig,
  listConfigs,
  uiI18n,
  configI18n,
  originalData,
  isEditMode,

  setLang,
  setTemplate,
  setModule,
  setResumeData,
  setModulesConfig,
  setSkillsConfig,
  setContactFieldsConfig,
  setListConfig,
  clearListConfigs,
  setUiI18n,
  setConfigI18n,
  setOriginalData,
  setEditMode,
  hasUnsavedChanges,
  setResumeDataModule,
  setResumeDataSkillsCategory,
  updateResumeDataField,
  updateResumeDataListItem,
  updateResumeDataSkillsItem,
  updateResumeDataSkillsSoft,
  pushResumeDataModuleItem,
  deleteResumeDataModuleItem,
  pushResumeDataSkillsItem,
  deleteResumeDataSkillsItem,
  deleteResumeDataSkillsSoftItem
};
