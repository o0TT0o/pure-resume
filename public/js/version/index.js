// ==================== 版本控制 ====================

import {
  currentLang,
  resumeData,
  originalData,
  uiI18n
} from '../core/state.js';
import {
  setOriginalData,
  setResumeDataModule
} from '../core/state.js';
import { showLoading, hideLoading } from '../utils/loading.js';
import { renderEditor } from '../editor/editor.js';
import { renderPreview } from '../data/preview.js';

// 保存当前模块
export async function saveCurrentModule() {
  try {
    const { currentModule } = await import('../core/state.js');

    // 检查是否有变化
    const hasChanges = JSON.stringify(resumeData[currentModule] || {}) !== JSON.stringify(originalData[currentModule] || {});

    if (!hasChanges) {
      alert(uiI18n.modal?.version?.noChanges || '没有检测到任何修改');
      return;
    }

    showLoading(uiI18n.common?.loading || '正在保存...');

    // 先保存快照
    await fetch('/api/version/snapshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ langCode: currentLang, module: currentModule })
    });

    // 对比修改
    const comparison = await fetch('/api/version/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        langCode: currentLang,
        module: currentModule,
        newData: resumeData[currentModule] || {}
      })
    }).then(r => r.json());

    // 如果有修改,显示版本对比
    if (comparison.hasChanges) {
      const confirmed = await showVersionComparison(comparison);
      if (!confirmed) {
        hideLoading();
        return;
      }
    }

    // 保存数据
    const response = await fetch(`/api/data/${currentLang}/${currentModule}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData[currentModule] || {})
    });

    if (!response.ok) {
      throw new Error(uiI18n.common?.error || '保存失败');
    }

    // 更新原始数据
    originalData[currentModule] = JSON.parse(JSON.stringify(resumeData[currentModule] || {}));
    setOriginalData(currentModule, originalData[currentModule]);

    hideLoading();
    alert(uiI18n.common?.success || '操作成功');
  } catch (error) {
    console.error('保存失败:', error);
    alert(`${uiI18n.common?.error || '操作失败'}: ${error.message}`);
    hideLoading();
  }
}

// 显示版本对比
export async function showVersionComparison(result) {
  if (!result.hasChanges) {
    alert(uiI18n.modal?.version?.noChanges || '没有检测到任何修改');
    return false;
  }

  return new Promise((resolve) => {
    let comparisonHTML = '<div class="version-comparison">';

    result.changes.forEach(change => {
      const icon = getChangeIcon(change.type);
      const color = getChangeColor(change.type);

      comparisonHTML += `
        <div class="change-item change-${change.type}" style="border-left: 3px solid ${color}">
          <div class="change-header">
            <span class="change-icon">${icon}</span>
            <span class="change-path">${change.path}</span>
            <span class="change-type">${getChangeLabel(change.type)}</span>
          </div>
          ${renderChangeDetail(change)}
        </div>
      `;
    });

    comparisonHTML += '</div>';

    const modal = document.createElement('div');
    modal.className = 'version-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${uiI18n.modal?.version?.title || '版本对比'}</h3>
          <button class="modal-close">${uiI18n.modal?.close || '✕'}</button>
        </div>
        <div class="modal-body">
          ${comparisonHTML}
        </div>
        <div class="modal-footer">
          <button class="btn-secondary btn-cancel">${uiI18n.common?.cancel || '取消'}</button>
          <button class="btn-primary btn-confirm">${uiI18n.modal?.version?.confirm || '确认保存'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 绑定事件
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const confirmBtn = modal.querySelector('.btn-confirm');

    const closeModal = () => {
      modal.remove();
      resolve(false);
    };

    const handleConfirm = () => {
      modal.remove();
      resolve(true);
    };

    overlay.onclick = closeModal;
    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    confirmBtn.onclick = handleConfirm;
  });
}

// 获取变更图标
function getChangeIcon(type) {
  const icons = {
    'added': '+',
    'removed': '-',
    'modified': '→',
    'array_length': '📊'
  };
  return icons[type] || '•';
}

// 获取变更颜色
function getChangeColor(type) {
  const colors = {
    'added': '#52C41A',
    'removed': '#FF4D4F',
    'modified': '#FAAD14',
    'array_length': '#2E54FF'
  };
  return colors[type] || '#999999';
}

// 获取变更标签
function getChangeLabel(type) {
  const labels = {
    'added': uiI18n.common?.add || 'Added',
    'removed': uiI18n.common?.delete || 'Removed',
    'modified': uiI18n.common?.edit || 'Modified',
    'array_length': 'Array length changed'
  };
  return labels[type] || type;
}

// 渲染变更详情
function renderChangeDetail(change) {
  if (change.type === 'array_length') {
    return `
      <div class="change-detail">
        <span class="old-value">${change.old} items</span>
        <span>→</span>
        <span class="new-value">${change.new} items</span>
      </div>
    `;
  }

  return `
    <div class="change-detail">
      ${change.old !== undefined ? `<div class="old-value">${formatValue(change.old)}</div>` : ''}
      <div class="arrow">↓</div>
      ${change.new !== undefined ? `<div class="new-value">${formatValue(change.new)}</div>` : ''}
    </div>
  `;
}

// 格式化值
function formatValue(value) {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

// 重置当前模块
export async function resetCurrentModule() {
  if (confirm(uiI18n.common?.confirm || '确认')) {
    const { currentModule } = await import('../core/state.js');
    setResumeDataModule(currentModule, JSON.parse(JSON.stringify(originalData[currentModule] || {})));
    renderEditor();
    renderPreview();
  }
}

// 切换编辑模式
export async function toggleEditMode() {
  const isEditMode = checkEditMode();

  if (isEditMode) {
    // 退出编辑模式前检查是否有未保存的更改
    const { hasUnsavedChanges, uiI18n } = await import('../core/state.js');
    
    if (hasUnsavedChanges()) {
      const confirmed = confirm(
        uiI18n.modal?.unsavedChanges?.exit || '您有未保存的更改，退出编辑模式将丢失这些更改。是否继续？'
      );
      
      if (!confirmed) {
        // 用户取消，不退出编辑模式
        return;
      }
    }
    
    // 用户确认或没有未保存更改，退出编辑模式
    window.location.href = window.location.pathname;
  } else {
    // 进入编辑模式
    const urlParams = new URLSearchParams();
    urlParams.set('mode', 'edit');
    window.location.href = window.location.pathname + '?' + urlParams.toString();
  }
}

function checkEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') === 'edit';
}
