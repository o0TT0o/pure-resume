// ==================== 技能编辑器 ====================

import { uiI18n } from '../core/state.js';
import { getSkillCategories } from '../data/loader.js';

// 渲染技能编辑器
export async function renderSkillsEditor(data) {
  const categories = await getSkillCategories();
  let html = '';

  categories.forEach(category => {
    const items = data[category.id] || [];
    const isRated = category.type === 'rated';
    const isText = category.type === 'text';

    html += `<div class="skill-category"><h4>${category.name}</h4>`;

    if (isRated) {
      items.forEach((item, index) => {
        html += `
          <div class="skill-item" data-category="${category.id}" data-index="${index}">
            <input type="text" value="${item.name || ''}" onchange="updateSkill('${category.id}', ${index}, 'name', this.value)">
            <input type="range" min="1" max="${category.ratingScale || 5}" value="${item.level || 1}" oninput="this.nextElementSibling.textContent = this.value" onchange="updateSkill('${category.id}', ${index}, 'level', this.value)">
            <span class="skill-rating">${item.level || 1}</span>
            <button class="btn-danger" onclick="deleteSkill('${category.id}', ${index})">×</button>
          </div>
        `;
      });
      html += `<button class="add-item-btn" onclick="addSkill('${category.id}')">+ ${uiI18n.skills?.addSkill || '添加技能'}</button>`;
    } else if (isText) {
      items.forEach((item, index) => {
        html += `
          <div class="skill-item" data-category="${category.id}" data-index="${index}">
            <input type="text" value="${item.language || ''}" placeholder="${uiI18n.skills?.language || '语言'}" onchange="window.updateSkillLanguage('${category.id}', ${index}, 'language', this.value)">
            <input type="text" value="${item.level || ''}" placeholder="${uiI18n.skills?.language || '水平'}" onchange="window.updateSkillLanguage('${category.id}', ${index}, 'level', this.value)">
            <button class="btn-danger" onclick="deleteSkill('${category.id}', ${index})">×</button>
          </div>
        `;
      });
      html += `<button class="add-item-btn" onclick="addSkillLanguage('${category.id}')">+ ${uiI18n.skills?.addSkill || '添加技能'}</button>`;
    } else {
      items.forEach((skill, index) => {
        html += `
          <div class="skill-item">
            <input type="text" value="${skill || ''}" onchange="window.updateSoftSkill(${index}, this.value)">
            <button class="btn-danger" onclick="deleteSoftSkill(${index})">×</button>
          </div>
        `;
      });
      html += `<button class="add-item-btn" onclick="addSoftSkill()">+ ${uiI18n.skills?.addSkill || '添加技能'}</button>`;
    }

    html += '</div>';
  });

  return html;
}
