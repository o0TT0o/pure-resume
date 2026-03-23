// ==================== 列表编辑器 ====================

import { uiI18n } from '../core/state.js';
import { getListConfig } from '../data/loader.js';

// 渲染列表编辑器
export async function renderListEditor(module, data) {
  const items = Array.isArray(data) ? data : [];
  const listConfig = await getListConfig(module);

  let html = '';

  if (items.length === 0) {
    html += `<div class="empty-data"><h3>${uiI18n.preview?.noData || '暂无数据'}</h3><p>${uiI18n.preview?.clickToAdd || '点击下方按钮添加'}</p></div>`;
  } else {
    items.forEach((item, index) => {
      const titleField = listConfig.fields.find(f => f.id === 'company') ||
                      listConfig.fields.find(f => f.id === 'name') ||
                      listConfig.fields.find(f => f.id === 'school');
      const titleKey = titleField ? titleField.id : '';
      const title = item[titleKey] || uiI18n.preview?.unnamed || '未命名';

      html += `
        <div class="list-item" data-index="${index}">
          <div class="list-item-header">
            <h4>${title}</h4>
            <div class="list-item-actions">
              <button class="btn-secondary" onclick="editListItem('${module}', ${index})">${uiI18n.common?.edit || '编辑'}</button>
              <button class="btn-danger" onclick="deleteListItem('${module}', ${index})">${uiI18n.common?.delete || '删除'}</button>
            </div>
          </div>
          <div class="preview-item-description">${item.description || ''}</div>
        </div>
      `;
    });
  }

  // 统一使用对应的翻译键名
  const addButtonKeys = {
    'experience': uiI18n.experience?.addExperience || uiI18n.common?.add || '添加',
    'projects': uiI18n.projects?.addProject || uiI18n.common?.add || '添加',
    'education': uiI18n.education?.addEducation || uiI18n.common?.add || '添加',
    'certificates': uiI18n.certificates?.addCertificate || uiI18n.common?.add || '添加'
  };

  const addButtonText = addButtonKeys[module] || (uiI18n.common?.add || '添加');
  html += `<button class="add-item-btn" onclick="addListItem('${module}')">+ ${addButtonText}</button>`;

  return html;
}
