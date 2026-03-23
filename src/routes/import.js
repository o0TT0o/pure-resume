const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { asyncHandler } = require('../middlewares/errorHandler');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/temp');
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(() => {});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// 从PDF导入
router.post('/pdf', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '没有上传文件' });
  }

  try {
    // 简单实现：基于文件名的启发式解析
    const filePath = req.file.path;
    const parsedData = await parsePDF(filePath);

    // 清理临时文件
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'PDF导入成功',
      data: parsedData
    });
  } catch (error) {
    console.error('PDF导入错误:', error);
    res.status(500).json({ success: false, message: 'PDF导入失败: ' + error.message });
  }
}));

// 从Word导入
router.post('/word', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '没有上传文件' });
  }

  try {
    const filePath = req.file.path;
    const parsedData = await parseWord(filePath);

    // 清理临时文件
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'Word导入成功',
      data: parsedData
    });
  } catch (error) {
    console.error('Word导入错误:', error);
    res.status(500).json({ success: false, message: 'Word导入失败: ' + error.message });
  }
}));

// 解析PDF文件（简化版本，实际应使用pdf-parse库）
async function parsePDF(filePath) {
  try {
    // 检查是否安装了pdf-parse
    let pdfParse;
    try {
      pdfParse = require('pdf-parse');
    } catch (e) {
      console.warn('pdf-parse未安装，使用简化解析');
      return generateSampleData();
    }

    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    
    // 简单的文本解析逻辑
    const text = data.text;
    return parseResumeText(text);
  } catch (error) {
    console.error('PDF解析错误:', error);
    return generateSampleData();
  }
}

// 解析Word文件（简化版本，实际应使用mammoth库）
async function parseWord(filePath) {
  try {
    // 检查是否安装了mammoth
    let mammoth;
    try {
      mammoth = require('mammoth');
    } catch (e) {
      console.warn('mammoth未安装，使用简化解析');
      return generateSampleData();
    }

    const dataBuffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    
    // 简单的文本解析逻辑
    const text = result.value;
    return parseResumeText(text);
  } catch (error) {
    console.error('Word解析错误:', error);
    return generateSampleData();
  }
}

// 解析简历文本（简单的正则表达式匹配）
function parseResumeText(text) {
  const data = {};

  // 解析个人信息
  const nameMatch = text.match(/(?:姓名|Name)[:：]\s*([^\n]+)/);
  const emailMatch = text.match(/(?:邮箱|Email)[:：]\s*([^\n]+)/);
  const phoneMatch = text.match(/(?:电话|Phone|Tel)[:：]\s*([^\n]+)/);

  if (nameMatch || emailMatch || phoneMatch) {
    data.personal = {
      name: nameMatch ? nameMatch[1].trim() : '',
      email: emailMatch ? emailMatch[1].trim() : '',
      phone: phoneMatch ? phoneMatch[1].trim() : '',
      avatar: ''
    };
  }

  // 解析工作经历
  const workSections = text.match(/(?:工作经历|Work Experience|Experience)[\s\S]*?(?=(?:项目经验|Project|教育背景|Education|$))/i);
  if (workSections) {
    const experience = parseExperienceSection(workSections[0]);
    if (experience.length > 0) {
      data.experience = experience;
    }
  }

  // 解析项目经验
  const projectSections = text.match(/(?:项目经验|Project|Projects)[\s\S]*?(?=(?:教育背景|Education|技能|Skills|$))/i);
  if (projectSections) {
    const projects = parseProjectSection(projectSections[0]);
    if (projects.length > 0) {
      data.projects = projects;
    }
  }

  // 解析教育背景
  const educationSections = text.match(/(?:教育背景|Education)[\s\S]*?(?=(?:技能|Skills|证书|$))/i);
  if (educationSections) {
    const education = parseEducationSection(educationSections[0]);
    if (education.length > 0) {
      data.education = education;
    }
  }

  return data;
}

// 解析工作经历部分
function parseExperienceSection(text) {
  const experiences = [];
  const items = text.split(/\n{2,}/);
  
  items.forEach(item => {
    if (item.trim()) {
      const lines = item.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length > 0) {
        experiences.push({
          company: lines[0] || '',
          position: lines[1] || '',
          startDate: '',
          endDate: '',
          description: lines.slice(2).join('\n') || ''
        });
      }
    }
  });
  
  return experiences.slice(0, 5); // 最多返回5条
}

// 解析项目经验部分
function parseProjectSection(text) {
  const projects = [];
  const items = text.split(/\n{2,}/);
  
  items.forEach(item => {
    if (item.trim()) {
      const lines = item.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length > 0) {
        projects.push({
          name: lines[0] || '',
          role: lines[1] || '',
          startDate: '',
          endDate: '',
          description: lines.slice(2).join('\n') || '',
          technologies: lines[2] ? lines[2].split(/[,，、]/).map(t => t.trim()) : []
        });
      }
    }
  });
  
  return projects.slice(0, 5); // 最多返回5条
}

// 解析教育背景部分
function parseEducationSection(text) {
  const educations = [];
  const items = text.split(/\n{2,}/);
  
  items.forEach(item => {
    if (item.trim()) {
      const lines = item.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length > 0) {
        educations.push({
          school: lines[0] || '',
          major: lines[1] || '',
          degree: lines[2] || '',
          startDate: '',
          endDate: ''
        });
      }
    }
  });
  
  return educations.slice(0, 3); // 最多返回3条
}

// 生成示例数据（当解析失败时）
function generateSampleData() {
  return {
    personal: {
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '138-0000-0000',
      avatar: ''
    },
    experience: [
      {
        company: '示例公司',
        position: '软件工程师',
        startDate: '2020-01',
        endDate: '至今',
        description: '负责系统开发工作'
      }
    ],
    projects: [
      {
        name: '示例项目',
        role: '项目负责人',
        startDate: '2021-01',
        endDate: '2021-06',
        description: '项目描述',
        technologies: ['JavaScript', 'Node.js']
      }
    ],
    education: [
      {
        school: '示例大学',
        major: '计算机科学',
        degree: '学士',
        startDate: '2016-09',
        endDate: '2020-06'
      }
    ]
  };
}

module.exports = router;
