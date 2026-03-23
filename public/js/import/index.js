// ==================== 导入功能 ====================

import { showLoading, hideLoading } from '../utils/loading.js';
import { loadResumeData } from '../data/loader.js';
import { renderPreview } from '../data/preview.js';
import { switchModule } from '../handlers/module.js';
import { closeModal, createModal } from '../utils/modal.js';

// 显示导入模态框
export async function showImportModal() {
  const { uiI18n } = await import('../core/state.js');
  const bodyContent = `
    <div class="import-options">
      <div class="import-option" onclick="triggerImport('pdf')">
        <div class="import-icon">📄</div>
        <div class="import-label">${uiI18n.modal?.import?.fromPDF || '从PDF导入'}</div>
        <div class="import-desc">${uiI18n.modal?.import?.fromPDFDesc || '支持解析PDF文件提取简历内容'}</div>
      </div>
      <div class="import-option" onclick="triggerImport('word')">
        <div class="import-icon">📝</div>
        <div class="import-label">${uiI18n.modal?.import?.fromWord || '从Word导入'}</div>
        <div class="import-desc">${uiI18n.modal?.import?.fromWordDesc || '支持解析Word文件提取简历内容'}</div>
      </div>
    </div>
  `;

  const footerButtons = [
    { text: uiI18n.common?.cancel || '取消', className: 'btn-secondary', onclick: "closeModal('import-modal')" }
  ];

  createModal('import-modal', uiI18n.modal?.import?.title || '导入简历', bodyContent, footerButtons);
}

// 触发文件选择
export async function triggerImport(type) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { uiI18n } = await import('../core/state.js');
    showLoading(uiI18n.modal?.import?.importing || '正在导入文件...');
    closeModal('import-modal');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/import/${type}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`${uiI18n.validation?.importFailed || '导入失败'}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // 显示导入结果
        showImportResult(result);

        // 如果导入成功，重新加载数据
        await loadResumeData();
        await renderPreview();

        // 如果在编辑模式，刷新编辑器
        const { isEditMode, currentModule } = await import('../core/state.js');
        if (isEditMode && currentModule) {
          await switchModule(currentModule);
        }
      } else {
        alert(`${uiI18n.validation?.importFailed || '导入失败'}: ${result.message}`);
      }
    } catch (error) {
      console.error('导入错误:', error);
      alert(`${uiI18n.validation?.importFailed || '导入失败'}: ${error.message}`);
    } finally {
      hideLoading();
    }
  };

  input.click();
}

// 显示导入结果
export async function showImportResult(result) {
  const { uiI18n } = await import('../core/state.js');
  const bodyContent = `
    <div class="import-summary">
      <div class="summary-item">
        <span class="summary-label">${uiI18n.preview?.noData || '状态'}:</span>
        <span class="summary-value success">${uiI18n.modal?.import?.success || '✓ 导入成功'}</span>
      </div>
      ${result.data ? `
        <div class="summary-item">
          <span class="summary-label">${uiI18n.modal?.import?.parseModules || '解析模块'}:</span>
          <span class="summary-value">${Object.keys(result.data).join(', ')}</span>
        </div>
      ` : ''}
    </div>
    <div class="import-warning">
      ${uiI18n.modal?.import?.warning || '⚠️ 请检查导入的内容是否正确，如有需要请手动调整'}
    </div>
  `;

  const footerButtons = [
    { text: uiI18n.common?.ok || '确定', className: 'btn-primary', onclick: "closeModal('import-result-modal')" }
  ];

  createModal('import-result-modal', uiI18n.modal?.import?.result || '导入结果', bodyContent, footerButtons);
}
