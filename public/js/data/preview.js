// ==================== 预览渲染 ====================

import {
  currentTemplate,
  resumeData,
  currentLang,
  uiI18n
} from '../core/state.js';

// 渲染预览 - 通过API加载渲染后的模板
export async function renderPreview() {
  const previewFrame = document.getElementById('previewFrame');
  
  try {
    // 调用后端API渲染模板
    const response = await fetch(`/api/template/preview/${currentTemplate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: resumeData,
        langCode: currentLang
      })
    });

    if (!response.ok) {
      throw new Error(uiI18n.preview?.noData || '预览渲染失败');
    }

    const html = await response.text();
    
    // 将渲染后的HTML写入iframe
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  } catch (error) {
    console.error('渲染预览失败:', error);
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.body.innerHTML = `<p style="padding: 20px; color: #999;">${uiI18n.common?.error || 'Preview load failed'}</p>`;
  }
}
