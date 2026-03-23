// ==================== 初始化和核心逻辑 ====================

import {
  setUiI18n,
  setConfigI18n,
  setModulesConfig,
  isEditMode
} from './state.js';
import { loadUserSettings, saveUserSettings, updateModuleNav } from './settings.js';
import { setEditMode } from './state.js';

import { loadResumeData } from '../data/loader.js';
import { renderPreview } from '../data/preview.js';

// 检查URL参数,决定是否进入管理员模式
export function checkEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode') === 'edit';
  setEditMode(mode);
  return mode;
}

// 初始化
export async function init() {
  try {
    // 检查编辑模式
    checkEditMode();

    // 从本地存储加载用户设置
    loadUserSettings();

    showLoading('Loading...');

    // 获取当前语言
    const { currentLang: lang } = await import('./state.js');

    // 并行加载语言列表、模板列表和配置
    const [languages, templates, ui, config] = await Promise.all([
      fetch('/api/language/list').then(r => r.json()),
      fetch('/api/template/list').then(r => r.json()),
      fetch(`/api/language/${lang}`).then(r => r.json()),
      fetch(`/api/config/modules/i18n/${lang}`).then(r => r.json())
    ]);

    // 保存语言包
    setUiI18n(ui);
    setConfigI18n(config);
    setModulesConfig(config);

    // 更新模块导航文本
    updateModuleNav();

    // 填充语言选择器
    const langSelect = document.getElementById('languageSelect');
    langSelect.innerHTML = languages.languages.map(lang =>
      `<option value="${lang.code}">${lang.flag} ${lang.name}</option>`
    ).join('');

    // 填充模板选择器
    const templateSelect = document.getElementById('templateSelect');
    templateSelect.innerHTML = templates.map(template =>
      `<option value="${template.id}">${template.name}</option>`
    ).join('');

    // 设置默认值（从本地存储或 URL 参数加载的值）
    langSelect.value = lang;
    const { currentTemplate: tmpl } = await import('./state.js');
    templateSelect.value = tmpl;

    // 根据模式决定UI
    if (isEditMode) {
      // 编辑模式：显示编辑器面板
      document.getElementById('editorPanel').style.display = 'block';
      document.getElementById('editModeIndicator').style.display = 'inline';
      document.getElementById('editModeBtn').textContent = ui.header?.exitEditMode || '退出编辑';
      document.getElementById('editModeBtn').classList.add('btn-danger');
      document.getElementById('editModeBtn').classList.remove('btn-primary');
      document.getElementById('importBtn').style.display = 'inline-block';
      document.getElementById('uploadBtn').style.display = 'inline-block';

      // 加载初始数据
      await loadResumeData();

      // 显示当前模块（从本地存储加载）
      const { currentModule: module } = await import('./state.js');
      await switchModule(module);
    } else {
      // 访客模式：隐藏编辑器，只显示预览
      document.getElementById('editorPanel').style.display = 'none';
      document.getElementById('editModeIndicator').style.display = 'none';
      document.getElementById('editModeBtn').textContent = ui.header?.enterEditMode || '进入编辑';
      document.getElementById('editModeBtn').classList.remove('btn-danger');
      document.getElementById('editModeBtn').classList.add('btn-primary');
      document.getElementById('importBtn').style.display = 'none';
      document.getElementById('uploadBtn').style.display = 'none';

      // 仅加载数据用于预览
      await loadResumeData();
      await renderPreview();
    }

    // 保存当前设置
    saveUserSettings();

    hideLoading();
  } catch (error) {
    console.error('初始化失败:', error);
    const { uiI18n } = await import('./state.js');
    alert(`${uiI18n.common?.error || '操作失败'}: ${error.message}`);
    hideLoading();
  }
}

// 导入 switchModule 用于 init 函数
async function switchModule(module) {
  const { switchModule: _switchModule } = await import('../handlers/module.js');
  await _switchModule(module);
}

async function showLoading(message) {
  const { showLoading: _showLoading } = await import('../utils/loading.js');
  _showLoading(message);
}

async function hideLoading() {
  const { hideLoading: _hideLoading } = await import('../utils/loading.js');
  _hideLoading();
}
