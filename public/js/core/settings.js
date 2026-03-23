// ==================== 用户设置管理 ====================

import {
  setLang,
  setTemplate,
  setModule
} from './state.js';

// 保存用户设置到本地存储
export async function saveUserSettings() {
  const { currentLang, currentTemplate, currentModule, isEditMode } = await import('./state.js');
  const settings = {
    lang: currentLang,
    template: currentTemplate,
    module: currentModule,
    isEditMode: isEditMode
  };
  localStorage.setItem('resumeSettings', JSON.stringify(settings));
}

// 从本地存储加载用户设置
export function loadUserSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('resumeSettings') || '{}');
    if (settings.lang) setLang(settings.lang);
    if (settings.template) setTemplate(settings.template);
    if (settings.module) setModule(settings.module);
    // isEditMode 由 URL 参数控制，不从 localStorage 恢复
  } catch (error) {
    console.error('加载用户设置失败:', error);
  }
}

// 更新模块导航文本
export async function updateModuleNav() {
  const { modulesConfig, uiI18n } = await import('./state.js');
  
  const navButtons = document.querySelectorAll('.module-nav button');
  navButtons.forEach(btn => {
    const module = btn.dataset.module;
    const moduleConfig = modulesConfig.find(m => m.id === module);
    if (moduleConfig) {
      btn.textContent = moduleConfig.name;
    }
  });

  // 更新按钮文本
  if (uiI18n.header) {
    document.getElementById('exportPdfBtn').textContent = uiI18n.header.exportPDF;
    document.getElementById('exportWordBtn').textContent = uiI18n.header.exportWord;
    document.getElementById('importBtn').textContent = uiI18n.header.import;
    document.getElementById('uploadBtn').textContent = uiI18n.header.upload;
    document.getElementById('editModeIndicator').textContent = uiI18n.header.adminEditMode;
  }
  
  // 更新编辑面板按钮文本
  if (uiI18n.common) {
    const resetBtn = document.getElementById('resetBtn');
    const saveModuleBtn = document.getElementById('saveModuleBtn');
    if (resetBtn) resetBtn.textContent = uiI18n.common.reset || '重置';
    if (saveModuleBtn) saveModuleBtn.textContent = uiI18n.common.save || '保存';
  }
}
