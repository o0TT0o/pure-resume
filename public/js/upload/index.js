// ==================== 上传功能 ====================

import { updateResumeDataField } from '../core/state.js';
import { showLoading, hideLoading } from '../utils/loading.js';
import { createModal, closeModal, copyUrl } from '../utils/modal.js';
import { renderEditor } from '../editor/editor.js';
import { renderPreview } from '../data/preview.js';

// 显示上传模态框
export async function showUploadModal() {
  const { uiI18n } = await import('../core/state.js');
  const bodyContent = `
    <div class="upload-options">
      <div class="upload-option" onclick="triggerUpload('avatar')">
        <div class="upload-icon">👤</div>
        <div class="upload-label">${uiI18n.modal?.upload?.uploadAvatar || '上传头像'}</div>
        <div class="upload-desc">${uiI18n.modal?.upload?.uploadAvatarDesc || '上传个人头像图片 (支持 JPEG, PNG, GIF, WebP)'}</div>
      </div>
      <div class="upload-option" onclick="triggerUpload('project')">
        <div class="upload-icon">🖼️</div>
        <div class="upload-label">${uiI18n.modal?.upload?.uploadProject || '上传项目图片'}</div>
        <div class="upload-desc">${uiI18n.modal?.upload?.uploadProjectDesc || '上传项目展示图片 (支持 JPEG, PNG, GIF, WebP)'}</div>
      </div>
    </div>
    <input type="hidden" id="uploadType">
  `;

  const footerButtons = [
    { text: uiI18n.common?.cancel || '取消', className: 'btn-secondary', onclick: "closeModal('upload-modal')" }
  ];

  createModal('upload-modal', uiI18n.modal?.upload?.title || '上传图片', bodyContent, footerButtons);
}

// 触发文件选择
export async function triggerUpload(type) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(uiI18n.validation?.fileTooLarge || '文件大小不能超过5MB');
      return;
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert(uiI18n.validation?.invalidFileType || '只支持上传图片文件 (JPEG, PNG, GIF, WebP)');
      return;
    }

    showLoading(uiI18n.modal?.upload?.uploading || '正在上传图片...');
    closeModal('upload-modal');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`${uiI18n.validation?.uploadFailed || '上传失败'}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // 显示上传结果
        showUploadResult(result, type);

        // 如果是头像，更新当前模块的头像字段
        const { currentModule } = await import('../core/state.js');
        if (type === 'avatar' && currentModule === 'personal') {
          updateResumeDataField(currentModule, 'avatar', result.imageUrl);
          await renderEditor();
          await renderPreview();
        }

        // 如果是项目图片，复制到剪贴板
        if (type === 'project') {
          setTimeout(() => {
            copyUrl(result.imageUrl);
          }, 100);
        }
      } else {
        alert(`${uiI18n.validation?.uploadFailed || '上传失败'}: ${result.message}`);
      }
    } catch (error) {
      console.error('上传错误:', error);
      alert(`${uiI18n.validation?.uploadFailed || '上传失败'}: ${error.message}`);
    } finally {
      hideLoading();
    }
  };
  
  input.click();
}

// 显示上传结果
export async function showUploadResult(result) {
  const { uiI18n } = await import('../core/state.js');
  const bodyContent = `
    <div class="upload-preview">
      <img src="${result.imageUrl}" alt="上传的图片" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
    </div>
    <div class="upload-info">
      <div class="info-item">
        <span class="info-label">${uiI18n.modal?.upload?.imageURL || '图片URL'}:</span>
        <div class="info-url">${result.imageUrl}</div>
      </div>
      <button class="btn-secondary btn-copy-url" onclick="copyUrl('${result.imageUrl}')">${uiI18n.modal?.upload?.copyURL || '复制URL'}</button>
    </div>
  `;

  const footerButtons = [
    { text: uiI18n.common?.ok || '确定', className: 'btn-primary', onclick: "closeModal('upload-result-modal')" }
  ];

  createModal('upload-result-modal', uiI18n.modal?.upload?.success || '上传成功', bodyContent, footerButtons);
}
