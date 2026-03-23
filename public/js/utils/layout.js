// ==================== 布局调整 ====================

// 自动调整预览面板和iframe高度
export function adjustPreviewHeight() {
  const previewPanel = document.querySelector('.preview-panel');
  const previewFrame = document.getElementById('previewFrame');
  const editorPanel = document.querySelector('.editor-panel');

  if (previewPanel && previewFrame) {
    // 移除内联样式，让CSS控制
    previewPanel.style.height = '';
    previewFrame.style.height = '';
  }

  if (editorPanel) {
    // 移除内联样式，让CSS控制
    editorPanel.style.maxHeight = '';
  }
}
