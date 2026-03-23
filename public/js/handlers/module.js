// ==================== 模块切换 ====================

import {
  resumeData,
  originalData
} from '../core/state.js';
import {
  setModule,
  setOriginalData
} from '../core/state.js';
import { saveUserSettings } from '../core/settings.js';
import { renderEditor } from '../editor/editor.js';
import { renderPreview } from '../data/preview.js';

// 切换模块
export async function switchModule(module) {
  setModule(module);

  // 更新导航状态
  document.querySelectorAll('.module-nav button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.module === module);
  });

  // 保存原始数据用于对比
  originalData[module] = JSON.parse(JSON.stringify(resumeData[module] || {}));
  setOriginalData(module, originalData[module]);

  // 渲染编辑器
  await renderEditor();

  // 渲染预览
  await renderPreview();

  // 保存用户设置
  saveUserSettings();
}
