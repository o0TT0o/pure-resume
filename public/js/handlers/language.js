// ==================== 语言切换 ====================

import {
  setLang,
  setTemplate,
  setModulesConfig
} from '../core/state.js';
import {
  setUiI18n,
  setConfigI18n,
  clearListConfigs,
  hasUnsavedChanges
} from '../core/state.js';
import { saveUserSettings } from '../core/settings.js';
import { loadResumeData } from '../data/loader.js';
import { updateModuleNav } from '../core/settings.js';

// 切换语言
export async function handleLanguageChange() {
  const lang = document.getElementById('languageSelect').value;
  const tmpl = document.getElementById('templateSelect').value;

  // 检查是否有未保存的更改
  const { isEditMode, uiI18n } = await import('../core/state.js');
  if (isEditMode && hasUnsavedChanges()) {
    const confirmed = confirm(
      uiI18n.modal?.unsavedChanges?.language || '您有未保存的更改，切换语言将丢失这些更改。是否继续？'
    );
    if (!confirmed) {
      // 恢复选择框的值
      document.getElementById('languageSelect').value = (await import('../core/state.js')).currentLang;
      return;
    }
  }

  setLang(lang);
  setTemplate(tmpl);

  showLoading(uiI18n.common?.loading || 'Loading...');

  try {
    // 清除列表配置缓存，以便重新加载新语言的配置
    clearListConfigs();

    // 加载新的语言包和配置
    const [ui, config] = await Promise.all([
      fetch(`/api/language/${lang}`).then(r => r.json()),
      fetch(`/api/config/modules/i18n/${lang}`).then(r => r.json())
    ]);

    setUiI18n(ui);
    setConfigI18n(config);
    setModulesConfig(config);

    // 更新编辑模式按钮文本
    if (isEditMode) {
      document.getElementById('editModeBtn').textContent = ui.header?.exitEditMode || '退出编辑';
    } else {
      document.getElementById('editModeBtn').textContent = ui.header?.enterEditMode || '进入编辑';
    }

    // 更新模块导航文本
    updateModuleNav();

    // 重新加载简历数据
    await loadResumeData();

    // 重新渲染当前模块
    const { currentModule: module } = await import('../core/state.js');
    await switchModule(module);

    // 保存用户设置
    saveUserSettings();

    hideLoading();
  } catch (error) {
    console.error('切换语言失败:', error);
    const { uiI18n } = await import('../core/state.js');
    alert(`${uiI18n.common?.error || '操作失败'}: ${error.message}`);
    hideLoading();
  }
}

// 导入依赖函数
async function switchModule(module) {
  const { switchModule: _switchModule } = await import('./module.js');
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
