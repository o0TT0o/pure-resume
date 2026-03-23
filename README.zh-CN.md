# 简历维护系统

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://www.w3.org/html/)

## 📖 关于项目

简历，是一个十分个性化的表达。不会有一个能满足每个人需求的简历系统。可能有，但肯定是收费的。

曾经我用过在线的 web 版、应用版或是使用 python 转换等各类方法维护简历。但这些方法要么受制于人，要么操作过于繁杂，让人在维护简历这件小事上遭遇重重波折。

而且，当你经历千辛万苦导出了一份漂亮又满意的 PDF 版本之后，HR 和你说："还要一份 Word 版……" 😩

**但是，现在，AI 出现了！还有什么是做不了的？！** 🚀

我的理想是只需要在一个地方维护一份文件，就能适应各种简历需求。包括 web 版、PDF 版、Word 版，而且支持多语言。（以后直接对接各个公司的招聘接口就更好了，再加岗位自动匹配功能等）。

不仅能从前台改后台保存，也能从后台直接改。每当你做了一个新项目，或者换了一份新工作，亦或你只是看到了令你心动的主题，随时维护你的简历吧！让它时刻保持在最新的状态！✨

## 🎯 核心功能

- **✍️ 多格式导出**: Web 版、PDF、Word 版本一键生成
- **🌍 多语言支持**: 轻松切换不同语言版本
- **💾 双向编辑**: 前台可视化编辑 + 后台直接修改
- **🎨 模板系统**: 灵活的模板系统，支持自定义主题
- **🔄 实时预览**: 编辑时实时查看效果
- **📱 响应式设计**: 完美适配各种设备

## 🚀 快速开始

### 环境要求

- Node.js >= 14
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/resume-system.git
cd resume-system

# 安装依赖
npm install

# 启动开发服务器
npm start
```

访问 `http://localhost:3000` 开始使用。

## 📁 项目结构

```
Resume/
├── public/              # 前端资源
│   ├── index.html       # 主入口
│   └── js/              # JavaScript 模块
│       ├── core/        # 核心逻辑和状态管理
│       ├── editor/      # 编辑器组件
│       └── version/     # 版本控制
├── server/              # 后端服务器
├── data/                # 简历数据文件
└── templates/           # 简历模板
```

## 💡 使用说明

### 前台编辑

1. 选择语言和模板
2. 选择要编辑的模块（个人信息、工作经历、项目经验等）
3. 在编辑器中进行修改
4. 实时预览效果
5. 保存更改

### 快速更新

直接修改 `data/` 目录下的 JSON 文件，前端会自动同步更新。

### 导出简历

点击导出按钮，选择需要的格式（PDF/Word/Web）。

## 🔧 技术栈

- **前端**: HTML5, JavaScript (ES6+), CSS3
- **后端**: Node.js, Express
- **数据存储**: JSON 文件
- **导出**: PDF.js, html-docx-js

## 🛠️ 开发计划

- [ ] 雄心壮志，宏图伟业，升职加薪，迎娶白富美，走向人生巅峰

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！(bu shi

## 📝 许可证

MIT License

---

**P.S.** 虽然此项目的功能没有接入 AI 接口，但是用 AI 直接维护此项目是非常简单的，包括代码逻辑、维护前台样式模板、翻译简历、追加功能等。你可以把它打造成属于自己的完美的简历维护系统！🌟
