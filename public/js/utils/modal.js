// ==================== 模态框 ====================

import { uiI18n } from '../core/state.js';

// 创建模态框（通用函数）
export function createModal(modalId, title, bodyContent, footerButtons = []) {
  const modal = document.createElement('div');
  modal.className = `${modalId}-modal`;
  modal.id = modalId;

  let footerHTML = '';
  if (footerButtons.length > 0) {
    footerHTML = '<div class="modal-footer">';
    footerButtons.forEach(btn => {
      footerHTML += `<button class="${btn.className || ''}" onclick="${btn.onclick || ''}">${btn.text}</button>`;
    });
    footerHTML += '</div>';
  }

  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal('${modalId}')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="closeModal('${modalId}')">${uiI18n.modal?.close || '✕'}</button>
      </div>
      <div class="modal-body">
        ${bodyContent}
      </div>
      ${footerHTML}
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

// 关闭模态框
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.remove();
  }
}

// 复制URL
export function copyUrl(url) {
  const tempInput = document.createElement('input');
  tempInput.value = url;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  alert(uiI18n.modal?.upload?.urlCopied || 'URL已复制到剪贴板');
}
