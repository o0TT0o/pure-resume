// ==================== 编辑器渲染 ====================

import {
  resumeData,
  modulesConfig
} from '../core/state.js';
import { updateResumeDataField } from '../core/state.js';
import { renderPersonalEditor } from './personal.js';
import { renderListEditor } from './list.js';
import { renderSkillsEditor } from './skills.js';
import { renderPreview } from '../data/preview.js';

// 渲染编辑器
export async function renderEditor() {
  const editorContent = document.getElementById('editorContent');
  const { currentModule } = await import('../core/state.js');
  const data = resumeData[currentModule] || {};
  const moduleConfig = modulesConfig.find(m => m.id === currentModule);

  let html = `<div class="form-section"><h3>${moduleConfig.name}</h3>`;

  if (currentModule === 'personal') {
    html += await renderPersonalEditor(data);
  } else if (['experience', 'projects', 'education', 'certificates'].includes(currentModule)) {
    html += await renderListEditor(currentModule, data);
  } else if (currentModule === 'skills') {
    html += await renderSkillsEditor(data);
  }

  html += '</div>';
  editorContent.innerHTML = html;

  // 绑定事件监听器
  bindEditorEvents();
}

// 绑定编辑器事件
export async function bindEditorEvents() {
  const { currentModule } = await import('../core/state.js');
  if (currentModule === 'personal') {
    const inputs = document.querySelectorAll('#editorContent input, #editorContent textarea');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const name = e.target.name;
        updateResumeDataField(currentModule, name, e.target.value);
        renderPreview();
      });
    });
  }
}
