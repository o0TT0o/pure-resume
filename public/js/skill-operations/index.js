// ==================== 技能操作 ====================

import {
  updateResumeDataSkillsItem,
  updateResumeDataSkillsSoft,
  pushResumeDataSkillsItem,
  deleteResumeDataSkillsItem,
  deleteResumeDataSkillsSoftItem
} from '../core/state.js';
import { renderEditor } from '../editor/editor.js';
import { renderPreview } from '../data/preview.js';

// 添加技能
export async function addSkill(category) {
  pushResumeDataSkillsItem(category, { name: '', level: 1 });
  await renderEditor();
}

// 更新技能
export async function updateSkill(category, index, field, value) {
  updateResumeDataSkillsItem(category, index, field, value);
  renderPreview();
}

// 删除技能
export async function deleteSkill(category, index) {
  const { uiI18n } = await import('../core/state.js');
  if (confirm(uiI18n.common?.confirm || '确认')) {
    deleteResumeDataSkillsItem(category, index);
    await renderEditor();
    renderPreview();
  }
}

// 添加语言技能
export async function addSkillLanguage(category) {
  pushResumeDataSkillsItem(category, { language: '', level: '' });
  await renderEditor();
}

// 更新语言技能
export async function updateSkillLanguage(category, index, field, value) {
  updateResumeDataSkillsItem(category, index, field, value);
  renderPreview();
}

// 添加软技能
export async function addSoftSkill() {
  pushResumeDataSkillsItem('soft', '');
  await renderEditor();
}

// 更新软技能
export async function updateSoftSkill(index, value) {
  updateResumeDataSkillsSoft(index, value);
  renderPreview();
}

// 删除软技能
export async function deleteSoftSkill(index) {
  const { uiI18n } = await import('../core/state.js');
  if (confirm(uiI18n.common?.confirm || '确认')) {
    deleteResumeDataSkillsSoftItem(index);
    await renderEditor();
    renderPreview();
  }
}
