const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { asyncHandler } = require('../middlewares/errorHandler');

// 创建上传目录
const UPLOAD_DIR = path.join(__dirname, '../../uploads/images');
const AVATAR_DIR = path.join(UPLOAD_DIR, 'avatar');
const PROJECT_DIR = path.join(UPLOAD_DIR, 'project');

// 初始化目录
async function initUploadDirs() {
  try {
    await fs.mkdir(AVATAR_DIR, { recursive: true });
    await fs.mkdir(PROJECT_DIR, { recursive: true });
  } catch (error) {
    // 目录已存在，忽略错误
  }
}
initUploadDirs();

// 根据上传类型确定目标目录
function getUploadDir(type) {
  return type === 'avatar' ? AVATAR_DIR : PROJECT_DIR;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.body.type || 'project';
    const targetDir = getUploadDir(uploadType);
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = uniqueSuffix + ext;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件 (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// 符合设计文档：POST /api/upload/avatar - 上传头像
router.post('/avatar', upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      error: '没有上传文件',
      code: 'FILE_UPLOAD_ERROR'
    });
  }

  const imageUrl = `/uploads/images/avatar/${req.file.filename}`;

  res.json({
    success: true,
    message: '头像上传成功',
    imageUrl: imageUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
}));

// 符合设计文档：POST /api/upload/project - 上传项目图片
router.post('/project', upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      error: '没有上传文件',
      code: 'FILE_UPLOAD_ERROR'
    });
  }

  const imageUrl = `/uploads/images/project/${req.file.filename}`;

  res.json({
    success: true,
    message: '项目图片上传成功',
    imageUrl: imageUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
}));

// 符合设计文档：DELETE /api/upload/:filename - 删除图片
router.delete('/:filename', asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  // 安全验证：防止路径遍历攻击
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ 
      error: '无效的文件名',
      code: 'VALIDATION_ERROR'
    });
  }

  // 尝试在两个目录中查找文件
  const avatarPath = path.join(AVATAR_DIR, filename);
  const projectPath = path.join(PROJECT_DIR, filename);
  
  let filePath = null;
  try {
    await fs.access(avatarPath);
    filePath = avatarPath;
  } catch {
    try {
      await fs.access(projectPath);
      filePath = projectPath;
    } catch {
      return res.status(404).json({ 
        error: '文件不存在',
        code: 'FILE_NOT_FOUND'
      });
    }
  }

  // 删除文件
  await fs.unlink(filePath);

  res.json({ 
    success: true, 
    message: '图片删除成功',
    filename: filename
  });
}));

module.exports = router;
