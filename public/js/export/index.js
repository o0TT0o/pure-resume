// ==================== 导出功能 ====================

import { uiI18n } from '../core/state.js';
import { showLoading, hideLoading } from '../utils/loading.js';
import { downloadFile } from '../utils/download.js';

// 导出PDF
export async function exportPDF() {
  const lang = document.getElementById('languageSelect').value;
  const template = document.getElementById('templateSelect').value;

  showLoading(uiI18n.export?.generatingPDF || '正在生成PDF...');

  try {
    const response = await fetch(`/api/export/pdf/${template}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ langCode: lang })
    });

    if (!response.ok) {
      throw new Error(`${uiI18n.export?.failed || '导出失败'}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const filename = `resume-${template}-${lang}-${Date.now()}.pdf`;
    downloadFile(blob, filename);

  } catch (error) {
    console.error('PDF导出错误:', error);
    alert(`${uiI18n.common?.error || '操作失败'}: ${error.message}`);
  } finally {
    hideLoading();
  }
}

// 导出Word
export async function exportWord() {
  const lang = document.getElementById('languageSelect').value;
  const template = document.getElementById('templateSelect').value;

  showLoading(uiI18n.export?.generatingWord || '正在生成Word文档...');

  try {
    const response = await fetch(`/api/export/word/${template}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ langCode: lang })
    });

    if (!response.ok) {
      throw new Error(`${uiI18n.export?.failed || '导出失败'}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const filename = `resume-${template}-${lang}-${Date.now()}.docx`;
    downloadFile(blob, filename);

  } catch (error) {
    console.error('Word导出错误:', error);
    alert(`${uiI18n.common?.error || '操作失败'}: ${error.message}`);
  } finally {
    hideLoading();
  }
}
