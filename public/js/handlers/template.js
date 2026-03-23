// ==================== 模板切换 ====================

import { setTemplate, hasUnsavedChanges } from '../core/state.js';
import { saveUserSettings } from '../core/settings.js';
import { renderPreview } from '../data/preview.js';

// 切换模板
export async function handleTemplateChange() {
  const template = document.getElementById('templateSelect').value;

  // 检查是否有未保存的更改
  const { isEditMode, uiI18n } = await import('../core/state.js');
  if (isEditMode && hasUnsavedChanges()) {
    const confirmed = confirm(
      uiI18n.modal?.unsavedChanges?.template || '您有未保存的更改，切换模板可能需要重新加载页面。是否继续？'
    );
    if (!confirmed) {
      // 恢复选择框的值
      document.getElementById('templateSelect').value = (await import('../core/state.js')).currentTemplate;
      return;
    }
  }

  setTemplate(template);
  await renderPreview();
  // 保存用户设置
  saveUserSettings();
}
