// ==================== 个人信息编辑器 ====================

import { getContactFields } from '../data/loader.js';

// 渲染个人信息编辑器
export async function renderPersonalEditor(data) {
  const fields = await getContactFields();
  return fields.map(field => {
    const requiredAttr = field.required ? 'required' : '';
    const requiredLabel = field.required ? '<span class="required">*</span>' : '';
    const placeholder = field.placeholder || '';
    const value = data[field.id] || '';

    let inputHTML = '';
    switch (field.type) {
      case 'textarea':
        inputHTML = `<textarea name="${field.id}" ${requiredAttr} placeholder="${placeholder}">${value}</textarea>`;
        break;
      default:
        inputHTML = `<input type="${field.type}" name="${field.id}" value="${value}" placeholder="${placeholder}" ${requiredAttr}>`;
    }

    return `
      <div class="form-group">
        <label>${field.name} ${requiredLabel}</label>
        ${inputHTML}
      </div>
    `;
  }).join('');
}
