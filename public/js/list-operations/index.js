// ==================== 列表项操作 ====================

import {
  updateResumeDataListItem,
  pushResumeDataModuleItem,
  deleteResumeDataModuleItem
} from '../core/state.js';
import { renderEditor } from '../editor/editor.js';
import { renderPreview } from '../data/preview.js';
import { getListConfig } from '../data/loader.js';

// 添加列表项
export async function addListItem(module) {
  pushResumeDataModuleItem(module, {});
  await renderEditor();
}

// 删除列表项
export async function deleteListItem(module, index) {
  const { uiI18n: i18n } = await import('../core/state.js');
  if (confirm(i18n.common?.confirm || '确认')) {
    deleteResumeDataModuleItem(module, index);
    await renderEditor();
    renderPreview();
  }
}

// 编辑列表项
export async function editListItem(module, index) {
  const { resumeData } = await import('../core/state.js');
  const { uiI18n: i18n } = await import('../core/state.js');
  const item = resumeData[module][index];
  const listConfig = await getListConfig(module);
  let html = '<div style="max-height: 400px; overflow-y: auto;">';

  listConfig.fields.forEach(field => {
    const fieldLabel = field.name || field.id;
    const requiredAttr = field.required ? 'required' : '';
    html += `
      <div class="form-group">
        <label>${fieldLabel}</label>
        ${field.type === 'textarea'
          ? `<textarea id="edit-${field.id}" ${requiredAttr}>${item[field.id] || ''}</textarea>`
          : `<input type="${field.type === 'date' ? 'month' : 'text'}" id="edit-${field.id}" value="${item[field.id] || ''}" ${requiredAttr}>`
        }
      </div>
    `;
  });

  html += '</div>';

  const modal = document.createElement('div');
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000;">
      <div style="background: #fff; padding: 30px; border-radius: 8px; max-width: 500px; width: 90%;">
        <h3 style="margin-bottom: 20px;">${i18n.common?.edit || '编辑'} ${listConfig.name || i18n.common?.item || '项目'}</h3>
        ${html}
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button class="btn-secondary" onclick="document.getElementById('modalOverlay').remove()">${i18n.common?.cancel || '取消'}</button>
          <button class="btn-primary" onclick="saveListItem('${module}', ${index})">${i18n.common?.save || '保存'}</button>
        </div>
      </div>
    </div>
  `;
  modal.id = 'modalOverlay';
  document.body.appendChild(modal);
}

// 保存列表项
export async function saveListItem(module, index) {
  const { listConfigs } = await import('../core/state.js');
  listConfigs[module].fields.forEach(field => {
    const input = document.getElementById(`edit-${field.id}`);
    if (input) {
      updateResumeDataListItem(module, index, field.id, input.value);
    }
  });
  document.getElementById('modalOverlay').remove();
  await renderEditor();
  renderPreview();
}
