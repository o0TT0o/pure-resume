// ==================== 主入口文件 ====================
// 加载所有模块并暴露全局函数

// ==================== 核心模块 ====================
import { init, checkEditMode } from './js/core/init.js';

// ==================== 处理器模块 ====================
import { handleLanguageChange } from './js/handlers/language.js';
import { handleTemplateChange } from './js/handlers/template.js';
import { switchModule } from './js/handlers/module.js';

// ==================== 列表操作模块 ====================
import { addListItem, deleteListItem, editListItem, saveListItem } from './js/list-operations/index.js';

// ==================== 技能操作模块 ====================
import {
  addSkill,
  updateSkill,
  deleteSkill,
  addSkillLanguage,
  updateSkillLanguage,
  addSoftSkill,
  updateSoftSkill,
  deleteSoftSkill
} from './js/skill-operations/index.js';

// ==================== 导出模块 ====================
import { exportPDF, exportWord } from './js/export/index.js';

// ==================== 导入模块 ====================
import { showImportModal, triggerImport, showImportResult } from './js/import/index.js';

// ==================== 上传模块 ====================
import { showUploadModal, triggerUpload, showUploadResult } from './js/upload/index.js';

// ==================== 版本控制模块 ====================
import { saveCurrentModule, resetCurrentModule, toggleEditMode } from './js/version/index.js';

// ==================== 工具模块 ====================
import { showLoading, hideLoading } from './js/utils/loading.js';
import { downloadFile } from './js/utils/download.js';
import { closeModal, copyUrl } from './js/utils/modal.js';
import { adjustPreviewHeight } from './js/utils/layout.js';

// ==================== 暴露全局函数 ====================
window.handleLanguageChange = handleLanguageChange;
window.handleTemplateChange = handleTemplateChange;
window.switchModule = switchModule;
window.saveCurrentModule = saveCurrentModule;
window.resetCurrentModule = resetCurrentModule;
window.toggleEditMode = toggleEditMode;
window.checkEditMode = checkEditMode;

window.addListItem = addListItem;
window.deleteListItem = deleteListItem;
window.editListItem = editListItem;
window.saveListItem = saveListItem;

window.addSkill = addSkill;
window.updateSkill = updateSkill;
window.deleteSkill = deleteSkill;
window.addSkillLanguage = addSkillLanguage;
window.updateSkillLanguage = updateSkillLanguage;
window.addSoftSkill = addSoftSkill;
window.updateSoftSkill = updateSoftSkill;
window.deleteSoftSkill = deleteSoftSkill;

window.exportPDF = exportPDF;
window.exportWord = exportWord;

window.showImportModal = showImportModal;
window.triggerImport = triggerImport;
window.showImportResult = showImportResult;

window.showUploadModal = showUploadModal;
window.triggerUpload = triggerUpload;
window.showUploadResult = showUploadResult;

window.closeModal = closeModal;
window.copyUrl = copyUrl;

window.showLoading = showLoading;
window.hideLoading = hideLoading;

window.downloadFile = downloadFile;

window.adjustPreviewHeight = adjustPreviewHeight;

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  init();
  adjustPreviewHeight();
});

// 窗口大小改变时自动调整
window.addEventListener('resize', adjustPreviewHeight);
