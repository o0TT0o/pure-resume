# 在线简历网站 - 设计文档

## 项目概述
一个简洁、专业的在线简历网站，支持在线编辑、导入导出功能，支持多语言（用户自行维护）和多模板切换，无需数据库，基于纯 Node.js 实现。

## 重要说明

### ⚠️ 重要设计约束
- ❌ **不提供任何翻译功能**
- ❌ **不调用任何第三方 API**（包括 AI 服务）
- ❌ **不使用暗黑模式**（保持简洁的浅色主题）
- ❌ **不需要多人协作**（单用户本地系统）
- ✅ 用户自行维护各语言版本的简历内容
- ✅ 系统界面预设完整的各语言版本
- ✅ 语言切换仅加载用户预设的对应语言数据
- ✅ 导出功能针对用户当前查看的语言版本
- ✅ 2026年技术栈：Tailwind CSS + Markdown

## 设计文档索引

本项目的设计文档按模块划分，每个文档详细描述了对应模块的设计方案：

1. **[01-数据设计](./01-数据设计.md)** - 数据存储结构、数据格式、多语言包、模板配置
2. **[02-功能设计](./02-功能设计.md)** - 功能模块、API设计、多语言支持、模板系统
3. **[03-系统实现](./03-系统实现.md)** - 技术栈、项目结构、核心模块代码、语言服务、模板服务
4. **[04-页面风格设计](./04-页面风格设计.md)** - UI设计、色彩方案、组件样式、多模板风格（已支持国际化）
5. **[05-Tailwind模板用户手册](./05-Tailwind模板用户手册.md)** - 自定义模板开发指南、Tailwind CSS 教程、国际化最佳实践
6. **[06-简历数据架构优化方案](./06-简历数据架构优化方案.md)** - **高级优化**：配置驱动架构、消除硬编码、可扩展设计
7. **[07-快速实施指南](./07-快速实施指南.md)** - 快速上手指南：配置驱动的逐步实施、代码示例、验收标准

## 核心设计原则

### 1. 数据管理
- ❌ 不使用数据库
- ✅ JSON 文件存储
- ✅ 动态读写机制
- ✅ 自动备份机制
- ✅ **配置驱动架构**：消除硬编码，通过配置文件动态管理
- ✅ **i18n 多语言支持**：配置文件支持 i18nKey，自动加载对应语言文本
- ✅ 多语言数据包（languages/，动态添加语言无需修改代码）
- ✅ 模板配置文件（templates/，动态添加模块无需修改代码）

### 2. 功能特性
- ❌ 无登录注册系统
- ✅ 管理员模式（通过特定方式访问）
- ✅ 导出 PDF/Word
- ✅ 从 PDF/Word 导入
- ✅ 在线编辑和实时预览
- ✅ **多语言支持**（中文、英语、德语、法语、日语）
- ✅ **多种模板风格**（4种专业模板）

### 3. 技术实现
- ✅ Node.js 运行环境
- ✅ Express.js Web 框架
- ❌ 不使用 Vue/React
- ✅ 纯原生 JavaScript + HTML/CSS
- ✅ **Tailwind CSS**（2026年主流样式框架）
- ✅ **Markdown + Tailwind** 模板系统
- ✅ **版本对比**（当前版本 vs 修改后）

### 4. 页面风格
- ✅ 简洁专业的设计
- ✅ 参考 BOSS 直聘风格
- ✅ 响应式布局
- ✅ 打印友好
- ✅ **4种专业模板**：
  - BOSS直聘风格 - 简洁专业
  - 增强型时序式 - 突出时间线
  - 技能优先/混合式 - 技能展示优先
  - ATS优化极简风 - ATS系统兼容

## 快速开始

### 环境要求
- Node.js >= 14.x
- npm 或 yarn

### 安装步骤
```bash
# 克隆项目
git clone <repository-url>
cd resume-website

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产环境部署
npm start
```

### 目录结构
```
resume-website/
├── public/          # 前端静态资源
├── data/            # 数据文件目录
├── backup/          # 备份目录
├── languages/       # 多语言包
├── templates/       # 简历模板
├── uploads/         # 上传文件目录
│   └── images/
│       ├── avatar/  # 头像
│       └── project/ # 项目图片
├── src/             # 源代码
│   ├── server.js   # 服务器入口
│   ├── routes/     # 路由
│   ├── services/   # 业务逻辑
│   ├── middlewares/# 中间件
│   ├── schemas/    # 配置验证文件
│   └── utils/      # 工具函数
└── package.json
```

## 功能模块

### 访客模式
- 📖 浏览简历
- 📱 响应式展示
- 🖨️ 打印预览
- 🔗 分享链接

### 管理员模式
- ✏️ 在线编辑
- 👁️ 实时预览
- 🔃 拖拽排序
- 📤 导出 PDF/Word
- 📥 从 PDF/Word 导入
- 📦 数据备份与恢复
- 🔍 **版本对比**（保存前查看修改差异）

## 技术栈

### 后端
- **运行环境**: Node.js
- **Web框架**: Express.js
- **文件操作**: fs 模块
- **PDF生成**: Puppeteer
- **Word生成**: Pandoc（命令行，格式最标准）+ docx（备选）
- **PDF解析**: pdf-parse
- **Word解析**: mammoth
- **国际化**: i18next（仅系统界面）
- **模板引擎**: handlebars + marked（Markdown解析）
- **版本对比**: diff 库
- ⚠️ **注意**：不使用任何翻译服务、不使用任何第三方API

### 前端
- **核心**: 原生 JavaScript (ES6+)
- **样式**: **Tailwind CSS**（2026年主流）
- **模板**: Markdown + Tailwind CSS
- **API**: Fetch API
- **编辑器**: Quill.js / TinyMCE
- **图片处理**: Cropper.js
- **Markdown解析**: marked.js
- **国际化**: i18next（仅系统界面）
- **模板渲染**: handlebars
- **版本对比**: 原生 JavaScript + diff 库

## 数据结构

### 主要数据模块
- data/[lang]/personal.json - 各语言版本的个人基本信息
- data/[lang]/experience.json - 各语言版本的工作经历
- data/[lang]/projects.json - 各语言版本的项目经验
- data/[lang]/education.json - 各语言版本的学历信息
- data/[lang]/certificates.json - 各语言版本的证书信息
- data/[lang]/skills.json - 各语言版本的技能清单
- data/config.json - 系统配置
- data/modules/config.json - **模块配置（动态定义模块，支持i18n）**
- data/skills/config.json - **技能分类配置（支持i18n）**
- data/personal/fields-config.json - **联系字段配置（支持i18n）**
- languages/[lang]/config-i18n.json - **配置i18n文件（模块、技能、字段等的多语言文本）**
- src/schemas/modules.schema.json - **模块配置验证**
- src/schemas/skills.schema.json - **技能配置验证**
- src/schemas/contact-fields.schema.json - **联系字段验证**
- src/schemas/lists.schema.json - **列表配置验证**

### 系统界面语言包（子目录+双文件结构）
- languages/index.json - 语言索引配置
- languages/zh-CN/ - 中文语言包
  - config-i18n.json - 配置项翻译
  - ui.json - 系统界面翻译
- languages/en-US/ - 英文语言包
  - config-i18n.json - 配置项翻译
  - ui.json - 系统界面翻译
- languages/de-DE/ - 德文语言包
  - config-i18n.json - 配置项翻译
  - ui.json - 系统界面翻译
- languages/fr-FR/ - 法文语言包
  - config-i18n.json - 配置项翻译
  - ui.json - 系统界面翻译
- languages/ja-JP/ - 日文语言包
  - config-i18n.json - 配置项翻译
  - ui.json - 系统界面翻译

### 模板系统
- boss-zhipin - BOSS直聘风格
- enhanced-chronological - 增强型时序式
- skills-first - 技能优先/混合式
- ats-minimalist - ATS优化极简风

详细数据结构请参考 [01-数据设计](./01-数据设计.md)

## API 接口

### 数据接口
- `GET /api/data/:langCode/:module` - 获取指定语言的简历数据
- `POST /api/data/:langCode/:module` - 保存指定语言的简历数据
- `PUT /api/data/:module/:id` - 更新记录
- `DELETE /api/data/:module/:id` - 删除记录

### 导入导出接口
- `POST /api/export/pdf` - 导出 PDF
- `POST /api/export/word` - 导出 Word
- `POST /api/import/pdf` - 导入 PDF
- `POST /api/import/word` - 导入 Word

### 其他接口
- `POST /api/upload/avatar` - 上传头像
- `POST /api/upload/project` - 上传项目图片
- `DELETE /api/upload/:filename` - 删除图片
- `GET /api/backup/list` - 获取备份列表
- `POST /api/backup/create` - 创建备份

### 语言接口
- `GET /api/language/list` - 获取支持的语言列表
- `GET /api/language/:code` - 获取系统界面语言包
- `GET /api/data/:lang/:module` - 获取指定语言的简历数据
- `POST /api/data/:lang/:module` - 保存指定语言的简历数据
- `GET /api/language/status/:code` - 获取语言数据状态

### 版本接口
- `POST /api/version/snapshot` - 保存当前版本快照
- `POST /api/version/compare` - 对比当前版本和修改后数据
- `GET /api/version/list/:lang/:module` - 获取版本历史列表

### 模板接口
- `GET /api/template/list` - 获取所有模板列表
- `GET /api/template/:id` - 获取指定模板详情
- `POST /api/template/apply/:id` - 应用指定模板
- `GET /api/template/preview/:id` - 预览模板效果

详细 API 文档请参考 [02-功能设计](./02-功能设计.md)

## 部署方案

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
npm start
# 或使用 PM2
pm2 start src/server.js --name resume-website
```

详细部署方案请参考 [03-系统实现](./03-系统实现.md)

## 设计风格

### 色彩方案
- 主色：#2E54FF（专业蓝）
- 文字：#333333（深灰）
- 背景：#FFFFFF（白）、#F8F9FA（浅灰）

### 设计特点
- 简洁清晰的视觉层次
- 卡片式模块布局
- 圆润的边角设计
- 轻量的阴影效果
- 流畅的过渡动画

详细设计规范请参考 [04-页面风格设计](./04-页面风格设计.md)

### 自定义模板开发
详见 [05-Tailwind模板用户手册](./05-Tailwind模板用户手册.md)，包含完整的模板开发教程和 Tailwind CSS 使用指南。

## 维护指南

### 数据备份
- 自动备份：每次修改自动创建备份
- 手动备份：支持一键备份
- 备份保留：保留最近 10 次备份

### 数据迁移
- 导出完整数据包（ZIP 格式）
- 支持跨设备数据迁移
- 版本兼容性处理

### 监控与日志
- 访问日志记录
- 错误日志追踪
- 性能监控指标

## 安全考虑

### 访问控制
- 管理员入口隐藏
- IP 白名单（可选）
- 密钥保护

### 数据安全
- 文件上传限制
- 类型验证
- 路径遍历防护
- XSS 防护

## 开发路线图

### 第一阶段 (MVP)
- ✅ 基础简历展示
- ✅ 在线编辑功能
- ✅ PDF 导出
- ✅ 基础样式设计（BOSS直聘风格）

### 第二阶段
- ⬜ Word 导出/导入
- ⬜ PDF 导入
- ⬜ 图片管理
- ⬜ 备份与恢复
- ⬜ 多语言支持（中英德法日）
- ⬜ 模板切换功能

### 第三阶段
- ⬜ 多模板支持（4种模板完整实现）
- ⬜ **Tailwind CSS 升级**（替代原生CSS）
- ⬜ **版本对比功能**（当前版本 vs 修改后）
- ⬜ SEO 优化
- ⬜ 性能优化

## 常见问题

### Q: 为什么不使用数据库？
A: 为了保持系统的简单性和可移植性，个人简历数据量小，JSON 文件存储完全满足需求，且便于备份和迁移。

### Q: 如何进入管理员模式？
A: 通过特定 URL 参数（如 `?mode=edit`）或点击隐藏入口进入。建议在生产环境中配置 IP 白名单或密钥。

### Q: 导入功能准确度如何？
A: 导入功能通过智能解析和模式匹配实现，准确度取决于原始文档的结构。导入后支持手动调整。

### Q: 如何自定义样式？
A: 使用 Tailwind CSS 直接在 HTML 中添加类名，或修改 `public/css/custom.css` 文件。Tailwind 提供了完整的工具类，无需编写复杂 CSS。

### Q: 如何切换语言？
A: 点击页面右上角的语言切换按钮，选择目标语言即可。语言状态会保存在本地存储中。⚠️ 注意：语言切换仅加载用户预设的对应语言数据，不进行翻译。

### Q: 如何添加新的语言？
A: **优化后**，只需在 `languages/index.json` 中添加配置，无需修改代码：
```json
{
  "code": "es-ES",
  "name": "Español",
  "enabled": true,
  "dataModules": {
    "personal": true,
    "experience": true
  }
}
```

### Q: 如何添加新的数据模块？
A: **优化后**，只需在 `data/modules/config.json` 中定义，无需修改代码：
```json
{
  "awards": {
    "name": "奖项荣誉",
    "required": false,
    "file": "awards.json"
  }
}
```

### Q: 如何自定义技能分类？
A: **优化后**，在 `data/skills/config.json` 中添加自定义分类（支持i18n）：
```json
{
  "categories": [
    {
      "id": "management",
      "i18nKey": "skills.management",
      "type": "rated",
      "ratingScale": 5,
      "icon": "people"
    }
  ]
}
```
然后在 `languages/[lang]/config-i18n.json` 中添加对应语言的翻译：
```json
{
  "skills": {
    "management": "管理能力"  // 中文
  }
}
```

### Q: 什么是版本对比？
A: 保存前，系统会自动对比原始数据和修改后数据，弹窗展示所有差异（新增、修改、删除）。用户可以确认所有修改后再保存，避免误操作。

### Q: 版本对比如何工作？
A:
1. 编辑时系统自动保存当前快照
2. 点击保存时对比快照和修改后数据
3. 弹窗展示差异（绿色=新增，黄色=修改，红色=删除）
4. 用户确认后保存，或取消继续编辑
5. 每个模块保留最近10个版本

### Q: 为什么要用 Tailwind CSS？
A: Tailwind CSS 是2026年的主流选择：
- 快速迭代样式（改配色、间距只需几秒）
- 响应式开箱即用
- 可维护性高（工具类复用）
- 社区活跃，文档完善

### Q: 支持哪些语言？
A: 目前支持：中文（简体）、英语、德语、法语、日语。系统界面预设了所有语言，但简历内容需要用户自行维护。

### Q: 如何创建自定义模板？
A: 参考 [05-Tailwind模板用户手册](./05-Tailwind模板用户手册.md)，在 `templates/` 目录下创建新文件夹，包含 `config.json`、`content.md`、`template.html` 三个必需文件，以及可选的 `tailwind.config.js` 和 `style.css`。

### Q: 模板如何支持多语言？
A: 模板使用两种数据源：
1. **简历数据**（`data/[lang]/`）：使用 `{{personal.name}}`、`{{experience}}` 等变量
2. **界面文本**（`languages/[lang]/ui.json`）：使用 `{{i18n.experience.section}}` 等变量

示例：
```markdown
## {{i18n.experience.section}}  ← 界面文本（章节标题）

{{#each experience}}
### {{company}}               ← 简历数据
**{{position}}**
...
{{/each}}
```

### Q: 如何添加新的语言？
A: **优化后**，只需在 `languages/index.json` 中添加配置，无需修改代码：
```json
{
  "code": "es-ES",
  "name": "Español",
  "enabled": true,
  "dataModules": {
    "personal": true,
    "experience": true,
    // ...
  }
}
```

### Q: 如何添加新的数据模块？
A: **优化后**，只需在 `data/modules/config.json` 中定义，无需修改代码：
```json
{
  "awards": {
    "name": "奖项荣誉",
    "required": false,
    "file": "awards.json"
  }
}
```

### Q: 如何自定义技能分类？
A: **优化后**，在 `data/skills/config.json` 中添加自定义分类（支持i18n）：
```json
{
  "categories": [
    {
      "id": "management",
      "i18nKey": "skills.management",
      "type": "rated",
      "ratingScale": 5,
      "icon": "people"
    }
  ]
}
```
然后在 `languages/[lang]/config-i18n.json` 中添加对应语言的翻译：
```json
{
  "skills": {
    "management": "管理能力"  // 中文
  }
}
```

### Q: 所有模板都支持导出吗？
A: 是的，所有模板都完整支持 PDF 和 Word 导出，并保持模板的视觉效果。导出功能针对用户当前查看的语言版本。

### Q: 所有模板都支持导出吗？
A: 是的，所有模板都完整支持 PDF 和 Word 导出，并保持模板的视觉效果。导出功能针对用户当前查看的语言版本。

### Q: 如何维护多语言简历？
A:
1. 进入编辑模式，选择目标语言
2. 编辑并保存该语言版本的简历内容
3. 可以使用"复制数据"功能将现有内容复制到新语言
4. 也可以直接编辑后台 `data/[lang]/` 目录下的 JSON 文件

### Q: 为什么不提供翻译功能？
A: 为了确保简历内容的专业性和准确性，翻译工作由用户自行完成。系统仅提供多语言版本的管理和切换功能。

## 贡献指南

### 代码规范
- 使用 ES6+ 语法
- 遵循语义化命名
- 添加必要的注释
- 保持代码简洁清晰

### 提交规范
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具相关

## 许可证
MIT License

## 联系方式
如有问题或建议，请通过以下方式联系：
- GitHub Issues
- Email: your-email@example.com

---

**最后更新**: 2026-03-18
**版本**: v2.0 (新增多语言和模板系统)
**版本**: v2.0 (新增多语言和模板系统)
