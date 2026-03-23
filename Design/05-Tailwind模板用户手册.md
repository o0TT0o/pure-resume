# Tailwind CSS 自定义模板用户手册

## 目录
1. [简介](#简介)
2. [模板结构说明](#模板结构说明)
3. [创建自定义模板](#创建自定义模板)
4. [Tailwind CSS 基础](#tailwind-css-基础)
5. [Markdown 模板编写](#markdown-模板编写)
6. [HTML 布局框架](#html-布局框架)
7. [配置文件](#配置文件)
8. [实战示例](#实战示例)
9. [常见问题](#常见问题)
10. [最佳实践](#最佳实践)

---

## 简介

本手册指导您如何使用 Tailwind CSS 创建自定义简历模板，并将其集成到简历系统中。

### 为什么要自定义模板？
- 打造个性化的简历风格
- 针对特定行业优化设计
- 突出个人优势特点
- 提高简历视觉吸引力

### 模板系统优势
- **Tailwind CSS**: 快速样式开发，无需编写复杂 CSS
- **Markdown**: 内容与样式分离，易于维护
- **响应式**: 自动适配各种设备
- **导出友好**: 完美支持 PDF 和 Word 导出
- **配置驱动**: 所有可变配置从配置文件读取，消除硬编码

---

## 模板结构说明

每个模板都是一个独立的文件夹，包含以下文件：

```
templates/your-template-name/
├── config.json           # 模板配置文件（必需）
├── content.md            # Markdown 内容模板（必需）
├── template.html         # HTML 布局框架（必需）
├── tailwind.config.js    # Tailwind 配置（可选）
└── style.css             # 补充样式（可选）
```

### 文件说明

| 文件 | 必需 | 说明 |
|------|------|------|
| config.json | ✅ | 模板基本信息、元数据、预览图等 |
| content.md | ✅ | 简历内容的 Markdown 模板 |
| template.html | ✅ | HTML 结构和 Tailwind 类名 |
| tailwind.config.js | ❌ | 自定义 Tailwind 主题配置 |
| style.css | ❌ | Tailwind 无法覆盖的自定义样式 |

---

## 创建自定义模板

### 步骤 1: 创建模板目录

在 `templates/` 目录下创建新文件夹：

```bash
mkdir templates/my-custom-template
cd templates/my-custom-template
```

### 步骤 2: 创建配置文件

创建 `config.json` 文件：

```json
{
  "id": "my-custom-template",
  "name": "我的自定义模板",
  "description": "简洁现代的设计风格，适合创意类职位",
  "author": "Your Name",
  "version": "1.0.0",
  "category": "modern",
  "preview": "preview.jpg",
  "features": [
    "响应式设计",
    "现代配色",
    "突出技能展示"
  ],
  "languages": ["zh-CN", "en-US"]
}
```

### 步骤 3: 创建 Markdown 内容模板（支持国际化）

创建 `content.md` 文件：

```markdown
# {{personal.name}}

{{personal.title}}

---

## {{i18n.personal.summary}}

{{personal.summary}}

---

## {{i18n.experience.section}}

{{#each experience}}
### {{company}}
**{{position}}**
_{{startDate}} - {{endDate}}_

{{description}}

{{#each achievements}}
- {{this}}
{{/each}}

{{/each}}

---

## {{i18n.skills.section}}

{{#each skills.technical}}
- **{{name}}** ({{level}}/5)
{{/each}}
```

**国际化说明：**
- 章节标题使用 `{{i18n.xxx.xxx}}` 格式（如 `{{i18n.experience.section}}`）
- 系统会从 `languages/[lang].json` 读取对应语言的翻译
- 简历数据使用 `{{personal.xxx}}` 格式，从 `data/[lang]/` 读取

### 步骤 4: 创建 HTML 布局框架

创建 `template.html` 文件：

```html
<div class="max-w-4xl mx-auto bg-white min-h-screen p-12">
  <!-- 个人信息区 -->
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-2">{{personal.name}}</h1>
    <p class="text-xl text-gray-600 mb-4">{{personal.title}}</p>
    <p class="text-gray-700">{{personal.summary}}</p>
  </div>

  <!-- Markdown 渲染的内容区 -->
  <div class="prose max-w-none">
    {{{content}}}
  </div>
</div>
```

### 步骤 5: 添加 Tailwind 配置（可选）

创建 `tailwind.config.js` 文件：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

### 步骤 6: 添加补充样式（可选）

创建 `style.css` 文件：

```css
/* 自定义补充样式 */
.my-custom-template h2 {
  @apply text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary;
}

.my-custom-template ul {
  @apply list-disc list-inside space-y-2 text-gray-700;
}
```

### 步骤 7: 添加预览图

将模板预览图命名为 `preview.jpg` 放入模板目录，建议尺寸：320×448px

---

## Tailwind CSS 基础

### 核心概念

Tailwind CSS 是一个实用优先的 CSS 框架，通过类名直接应用样式。

#### 1. 布局类

```html
<!-- 容器 -->
<div class="container mx-auto px-4">
  <div class="max-w-4xl">...</div>
</div>

<!-- Flexbox 布局 -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1">左侧内容</div>
  <div class="flex-1">右侧内容</div>
</div>

<!-- Grid 布局 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</div>
```

#### 2. 间距类

```html
<!-- 内边距 -->
<div class="p-4"> padding 16px </div>
<div class="px-6 py-3"> padding-x 24px, padding-y 12px </div>

<!-- 外边距 -->
<div class="mt-4"> margin-top 16px </div>
<div class="mx-auto"> 左右居中 </div>

<!-- 间距 -->
<div class="gap-4"> flex 或 grid 子元素间距 16px </div>
```

#### 3. 文本类

```html
<!-- 字体大小 -->
<h1 class="text-4xl">特大标题</h1>
<h2 class="text-2xl">大标题</h2>
<p class="text-base">正文</p>
<p class="text-sm">小字</p>

<!-- 字重 -->
<p class="font-normal">普通</p>
<p class="font-semibold">半粗</p>
<p class="font-bold">粗体</p>

<!-- 文本颜色 -->
<p class="text-gray-900">深灰</p>
<p class="text-gray-600">中灰</p>
<p class="text-primary">主色</p>

<!-- 文本对齐 -->
<p class="text-left">左对齐</p>
<p class="text-center">居中</p>
<p class="text-right">右对齐</p>
```

#### 4. 颜色类

```html
<!-- 背景色 -->
<div class="bg-white">白色背景</div>
<div class="bg-gray-100">浅灰背景</div>
<div class="bg-primary">主色背景</div>

<!-- 渐变背景 -->
<div class="bg-gradient-to-r from-blue-500 to-purple-500">
  蓝紫渐变
</div>

<!-- 边框色 -->
<div class="border-2 border-gray-300">灰色边框</div>
```

#### 5. 边框和圆角

```html
<!-- 边框宽度 -->
<div class="border">1px 边框</div>
<div class="border-2">2px 边框</div>
<div class="border-t">顶部边框</div>

<!-- 圆角 -->
<div class="rounded">小圆角 (4px)</div>
<div class="rounded-lg">中等圆角 (8px)</div>
<div class="rounded-full">完全圆角</div>
```

#### 6. 阴影

```html
<div class="shadow-sm">小阴影</div>
<div class="shadow">普通阴影</div>
<div class="shadow-lg">大阴影</div>
<div class="shadow-xl">超大阴影</div>
```

#### 7. 响应式设计

```html
<!-- 响应式前缀 -->
<div class="w-full md:w-1/2 lg:w-1/3">
  移动端全宽，平板半宽，桌面三分之一宽
</div>

<div class="text-sm md:text-base lg:text-lg">
  响应式字体大小
</div>

<!-- 可用断点 -->
<!-- sm: 640px -->
<!-- md: 768px -->
<!-- lg: 1024px -->
<!-- xl: 1280px -->
```

#### 8. 状态类

```html
<!-- 悬停状态 -->
<button class="bg-primary hover:bg-primary-dark transition-colors">
  按钮
</button>

<!-- 聚焦状态 -->
<input class="border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary">

<!-- 激活状态 -->
<button class="bg-primary active:bg-primary-dark">
  按钮
</button>
```

### 常用组合示例

```html
<!-- 卡片 -->
<div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h3 class="text-xl font-bold mb-2">卡片标题</h3>
  <p class="text-gray-600">卡片内容</p>
</div>

<!-- 按钮 -->
<button class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
  点击我
</button>

<!-- 分隔线 -->
<hr class="border-t-2 border-gray-200 my-6">

<!-- 徽章 -->
<span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
  标签
</span>
```

---

## Markdown 模板编写

### Handlebars 语法

模板使用 Handlebars 语法来动态插入数据。

#### 1. 变量插入

```markdown
# {{personal.name}}

{{personal.title}}
{{personal.summary}}
```

#### 2. 循环遍历

```markdown
## {{i18n.experience.section}}

{{#each experience}}
### {{company}}
**{{position}}**
_{{startDate}} - {{endDate}}_

{{description}}

{{#each achievements}}
- {{this}}
{{/each}}

{{/each}}
```

#### 3. 条件判断

```markdown
{{#if personal.avatar}}
![头像]({{personal.avatar}})
{{/if}}

{{#if certificates}}
## {{i18n.certificates.section}}

{{#each certificates}}
- {{name}} ({{issuer}})
{{/each}}
{{/if}}

{{#unless skills.technical}}
{{i18n.skills.empty}}
{{/unless}}
```

#### 4. 嵌套循环

```markdown
## {{i18n.skills.section}}

{{#each skills}}
### {{@key}}

{{#each this}}
- {{name}} - {{level}}
{{/each}}

{{/each}}
```

#### 5. 国际化变量（i18n）

**章节标题国际化：**
```markdown
## {{i18n.experience.section}}    ← 显示"工作经历"或"Work Experience"
## {{i18n.projects.section}}      ← 显示"项目经验"或"Projects"
## {{i18n.skills.section}}         ← 显示"技能"或"Skills"
```

**条件显示国际化：**
```markdown
{{#unless skills.technical}}
{{i18n.skills.empty}}             ← 显示"暂无技能信息"或"No skills available"
{{/unless}}
```

**ATS模板大写转换：**
```markdown
{{i18n.experience.section | uppercase}}    ← "工作经历" → "工作经历"，"Work Experience" → "WORK EXPERIENCE"
```

### 数据结构参考

```javascript
{
  personal: {
    name: "张三",
    title: "高级前端工程师",
    summary: "5年前端开发经验，擅长React和Vue",
    avatar: "/images/avatar.jpg",
    email: "zhangsan@example.com",
    phone: "138-xxxx-xxxx",
    location: "北京",
    contact: ["zhangsan@example.com", "138-xxxx-xxxx", "北京"]
  },
  experience: [
    {
      company: "ABC公司",
      position: "高级前端工程师",
      startDate: "2020-01",
      endDate: "至今",
      description: "负责公司核心产品的前端开发",
      achievements: [
        "主导了技术架构升级",
        "提升了页面加载速度50%"
      ]
    }
  ],
  projects: [
    {
      name: "电商平台",
      role: "技术负责人",
      startDate: "2020-01",
      endDate: "2020-12",
      description: "从零开始搭建电商平台",
      technologies: ["React", "Node.js", "MongoDB"],
      achievements: [
        "成功上线并获得10万+用户",
        "实现了日订单量1万+"
      ]
    }
  ],
  education: [
    {
      school: "北京大学",
      degree: "计算机科学与技术 本科",
      startDate: "2014-09",
      endDate: "2018-06"
    }
  ],
  certificates: [
    {
      name: "AWS认证解决方案架构师",
      issuer: "Amazon Web Services",
      date: "2023-06"
    }
  ],
  skills: {
    technical: [
      { name: "JavaScript", level: 5 },
      { name: "React", level: 4 },
      { name: "Vue", level: 4 }
    ],
    languages: [
      { language: "英语", level: "CET-6" }
    ]
  }
}
```

### Markdown 高级用法

#### 1. 表格

```markdown
| 技能 | 熟练度 |
|------|--------|
| JavaScript | 精通 |
| React | 熟练 |
| Vue | 熟练 |
```

#### 2. 代码块

```markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
```

#### 3. 引用

```markdown
> "编程不是为了写代码，而是为了解决问题。"
```

#### 4. 列表

```markdown
- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2
```

---

## HTML 布局框架

### 基本结构

```html
<div class="max-w-4xl mx-auto bg-white min-h-screen">
  <!-- 头部区域 -->
  <div class="...">
    <!-- 个人信息 -->
  </div>

  <!-- 内容区域 -->
  <div class="...">
    <!-- Markdown 渲染的内容 -->
    {{{content}}}
  </div>

  <!-- 底部区域 -->
  <div class="...">
    <!-- 页脚信息 -->
  </div>
</div>
```

### 模板变量说明

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{{content}}}` | Markdown 渲染后的 HTML | 必需，插入内容区 |
| `{{personal.*}}` | 个人信息 | `{{personal.name}}` |
| `{{experience}}` | 工作经历数组 | 需要在 content.md 中循环 |
| `{{projects}}` | 项目经验数组 | 需要在 content.md 中循环 |
| `{{education}}` | 教育背景数组 | 需要在 content.md 中循环 |
| `{{certificates}}` | 证书数组 | 需要在 content.md 中循环 |
| `{{skills}}` | 技能对象 | 需要在 content.md 中循环 |

### 响应式布局示例

#### 左右两栏布局

```html
<div class="flex flex-col lg:flex-row gap-8">
  <!-- 左侧边栏 -->
  <aside class="w-full lg:w-1/3">
    <img src="{{personal.avatar}}" alt="头像"
         class="w-32 h-32 rounded-full mx-auto mb-4">
    <h1 class="text-2xl font-bold text-center">{{personal.name}}</h1>
  </aside>

  <!-- 右侧内容 -->
  <main class="flex-1">
    {{{content}}}
  </main>
</div>
```

#### 顶部固定侧边栏

```html
<div class="flex gap-8">
  <!-- 固定侧边栏 -->
  <aside class="w-80 flex-shrink-0 sticky top-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- 个人信息 -->
    </div>
  </aside>

  <!-- 滚动内容区 -->
  <main class="flex-1">
    {{{content}}}
  </main>
</div>
```

#### 顶部全宽布局

```html
<!-- 顶部全宽头部 -->
<div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
  <div class="max-w-4xl mx-auto px-8 text-center">
    <h1 class="text-4xl font-bold mb-2">{{personal.name}}</h1>
    <p class="text-xl text-blue-100">{{personal.title}}</p>
  </div>
</div>

<!-- 内容区 -->
<div class="max-w-4xl mx-auto px-8 py-12">
  {{{content}}}
</div>
```

### Tailwind 类名最佳实践

#### 1. 保持类名顺序

```html
<!-- 推荐：按功能分组 -->
<div class="
  flex flex-col gap-4
  p-6 bg-white rounded-lg shadow-lg
  hover:shadow-xl transition-shadow
">
  内容
</div>

<!-- 不推荐：混乱的类名顺序 -->
<div class="p-6 flex bg-white rounded-lg gap-4 shadow-lg hover:shadow-xl">
  内容
</div>
```

#### 2. 使用语义化的类名

```html
<!-- 推荐 -->
<div class="card">
  <h3 class="card-title">标题</h3>
  <p class="card-content">内容</p>
</div>

<!-- 不推荐 -->
<div class="bg-white rounded-lg shadow-lg p-6">
  <h3 class="text-xl font-bold">标题</h3>
  <p class="text-gray-700">内容</p>
</div>
```

#### 3. 提取公共样式到 tailwind.config.js

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b'
      }
    }
  }
}
```

```html
<!-- 使用自定义颜色 -->
<div class="bg-primary text-white">
  使用自定义主色
</div>
```

---

## 配置文件

### config.json 完整示例

```json
{
  "id": "my-template",
  "name": "我的模板",
  "name_en": "My Template",
  "description": "简洁现代的设计风格",
  "description_en": "Simple and modern design",
  "author": "Your Name",
  "email": "your-email@example.com",
  "website": "https://yourwebsite.com",
  "version": "1.0.0",
  "created": "2026-03-18",
  "updated": "2026-03-18",
  "category": "modern",
  "tags": [
    "modern",
    "clean",
    "professional"
  ],
  "preview": "preview.jpg",
  "thumbnail": "thumbnail.png",
  "features": [
    "响应式设计",
    "现代配色",
    "突出技能展示",
    "打印友好"
  ],
  "languages": ["zh-CN", "en-US", "ja-JP"],
  "supported_modules": [
    "personal",
    "experience",
    "projects",
    "education",
    "certificates",
    "skills"
  ],
  "print_options": {
    "break_after_modules": false,
    "hide_empty_modules": true
  },
  "custom_settings": {
    "primary_color": "#2563eb",
    "font_family": "Inter"
  }
}
```

### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| id | string | ✅ | 模板唯一标识符 |
| name | string | ✅ | 模板中文名称 |
| name_en | string | ❌ | 模板英文名称 |
| description | string | ✅ | 模板中文描述 |
| description_en | string | ❌ | 模板英文描述 |
| author | string | ❌ | 作者名称 |
| email | string | ❌ | 作者邮箱 |
| website | string | ❌ | 作者网站 |
| version | string | ✅ | 版本号 |
| created | string | ❌ | 创建日期 |
| updated | string | ❌ | 更新日期 |
| category | string | ✅ | 模板分类 |
| tags | array | ❌ | 模板标签 |
| preview | string | ❌ | 预览图文件名 |
| thumbnail | string | ❌ | 缩略图文件名 |
| features | array | ❌ | 特性列表 |
| languages | array | ❌ | 支持的语言 |
| supported_modules | array | ❌ | 支持的模块 |
| print_options | object | ❌ | 打印选项 |
| custom_settings | object | ❌ | 自定义设置 |

### tailwind.config.js 示例

```javascript
module.exports = {
  theme: {
    extend: {
      // 自定义颜色
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8',
          contrast: '#ffffff'
        },
        secondary: {
          DEFAULT: '#64748b',
          light: '#94a3b8',
          dark: '#475569'
        },
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706'
        }
      },

      // 自定义字体
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace']
      },

      // 自定义字体大小
      fontSize: {
        'xxs': '0.625rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },

      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },

      // 自定义圆角
      borderRadius: {
        '4xl': '2rem'
      },

      // 自定义阴影
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.3)'
      },

      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },

      // 自定义动画关键帧
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
```

---

## 实战示例

### 示例 1: 创意设计师模板

#### config.json

```json
{
  "id": "creative-designer",
  "name": "创意设计师",
  "description": "适合视觉设计师、UI/UX设计师",
  "author": "Design Team",
  "version": "1.0.0",
  "category": "creative",
  "features": [
    "大图展示",
    "创意布局",
    "色彩丰富"
  ]
}
```

#### content.md

```markdown
{{#if personal.avatar}}
![{{personal.name}}]({{personal.avatar}} "头像")
{{/if}}

# {{personal.name}}

{{personal.title}}

---

## 关于我

{{personal.summary}}

---

## 作品集

{{#each projects}}
### {{name}}

![{{name}}]({{thumbnail}})

**{{role}}** | {{startDate}} - {{endDate}}

{{description}}

**技术栈:** {{#each technologies}}{{this}} {{/each}}

{{#each achievements}}
- {{this}}
{{/each}}

{{/each}}

---

## 工作经历

{{#each experience}}
### {{company}}
**{{position}}**
_{{startDate}} - {{endDate}}_

{{description}}

{{#each achievements}}
- {{this}}
{{/each}}

{{/each}}

---

## 技能

{{#each skills.technical}}
{{name}} - {{level}}
{{/each}}
```

#### template.html

```html
<div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
  <div class="max-w-6xl mx-auto px-8 py-12">
    <!-- 个人信息区 -->
    <div class="bg-white rounded-3xl shadow-2xl p-12 mb-8 relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"></div>

      <div class="relative z-10">
        <div class="flex items-start gap-8">
          {{#if personal.avatar}}
          <div class="flex-shrink-0">
            <img src="{{personal.avatar}}" alt="{{personal.name}}"
                 class="w-48 h-48 rounded-3xl shadow-lg object-cover">
          </div>
          {{/if}}

          <div class="flex-1">
            <h1 class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {{personal.name}}
            </h1>
            <p class="text-2xl text-gray-600 mb-6">{{personal.title}}</p>
            <p class="text-gray-700 leading-relaxed text-lg">{{personal.summary}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Markdown 渲染的内容 -->
    <div class="bg-white rounded-3xl shadow-xl p-12 prose max-w-none">
      {{{content}}}
    </div>
  </div>
</div>
```

#### tailwind.config.js

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9333ea',
          light: '#a855f7',
          dark: '#7c3aed'
        },
        secondary: {
          DEFAULT: '#ec4899',
          light: '#f472b6',
          dark: '#db2777'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

### 示例 2: 极简主义者模板

#### config.json

```json
{
  "id": "minimalist",
  "name": "极简主义",
  "description": "极致简洁，黑白配色",
  "author": "Minimalist Team",
  "version": "1.0.0",
  "category": "minimalist",
  "features": [
    "黑白配色",
    "极简设计",
    "专业大气"
  ]
}
```

#### content.md

```markdown
{{personal.name}} | {{personal.title}}

{{personal.summary}}

---

WORK EXPERIENCE
{{#each experience}}
{{company}} | {{startDate}} - {{endDate}}
{{position}}

{{description}}

{{#each achievements}}
{{this}}
{{/each}}

{{/each}}

---

EDUCATION
{{#each education}}
{{school}} | {{startDate}} - {{endDate}}
{{degree}}
{{/each}}

---

SKILLS
{{#each skills.technical}}
{{name}} - {{level}}
{{/each}}
```

#### template.html

```html
<div class="max-w-4xl mx-auto bg-white min-h-screen p-16">
  <div class="space-y-12">
    <!-- 个人信息 -->
    <div class="text-center space-y-4">
      <h1 class="text-5xl font-bold text-black tracking-tight">
        {{personal.name}}
      </h1>
      <p class="text-xl text-gray-600 tracking-wide">
        {{personal.title}}
      </p>
      <p class="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
        {{personal.summary}}
      </p>
    </div>

    <hr class="border-t border-black">

    <!-- Markdown 内容 -->
    <div class="space-y-8 text-black">
      {{{content}}}
    </div>
  </div>
</div>
```

---

## 常见问题

### Q1: 如何调试模板？

**A:** 在浏览器中打开开发者工具（F12），查看元素和样式。Tailwind 类名会直接显示在 HTML 中，方便调试。

### Q2: 如何预览模板效果？

**A:**
1. 将模板文件夹放入 `templates/` 目录
2. 重启服务器
3. 在简历网站中切换到新模板
4. 实时查看效果

### Q3: 如何修改模板颜色？

**A:** 在 `tailwind.config.js` 中自定义颜色：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color'
      }
    }
  }
}
```

然后在模板中使用：

```html
<div class="bg-primary">使用自定义主色</div>
```

### Q4: 如何让模板支持多语言？

**A:** 使用 `{{i18n.xxx.xxx}}` 格式引用语言包：

```markdown
## {{i18n.experience.section}}    ← 章节标题
## {{i18n.projects.section}}      ← 章节标题
{{i18n.skills.empty}}             ← 提示文本
```

**数据来源：**
- 界面文本：`languages/[lang].json`
- 简历数据：`data/[lang]/`

**ATS模板大写：**
```markdown
{{i18n.experience.section | uppercase}}    ← "WORK EXPERIENCE"
```

### Q5: 如何分离简历数据和界面文本？

**A:** 使用不同的变量前缀：

```markdown
# {{personal.name}}           ← 简历数据（data/zh-CN/personal.json）
{{personal.title}}

## {{i18n.experience.section}} ← 界面文本（languages/zh-CN.json）

{{#each experience}}
### {{company}}               ← 简历数据
**{{position}}**
...
{{/each}}
```

**原则：**
- `{{personal.xxx}}`, `{{experience}}` 等 → 简历内容
- `{{i18n.xxx.xxx}}` → 界面文本（章节标题、按钮、提示）

### Q6: 如何优化打印效果？

**A:** 在模板中添加打印样式：

```html
<style>
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: white;
  }
}
</style>
```

### Q7: 如何添加自定义图标？

**A:** 使用 SVG 图标：

```html
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>
```

### Q8: 模板加载缓慢怎么办？

**A:**
1. 优化图片大小
2. 减少 Tailwind 类名数量
3. 使用 `tailwind.config.js` 的 `purge` 选项清理未使用的样式

### Q9: 如何分享自定义模板？

**A:**
1. 将模板文件夹打包为 ZIP
2. 分享给其他用户
3. 接收者解压到 `templates/` 目录即可使用

### Q10: i18n 变量找不到翻译怎么办？

**A:** 系统会保留原标记并显示警告。确保：
1. `languages/[lang].json` 中有对应的键值
2. 键名拼写正确（如 `experience.section`）
3. 语言包已正确加载

示例：
```json
// languages/zh-CN.json
{
  "experience": {
    "section": "工作经历",
    "company": "公司名称"
  }
}
```

---

## 最佳实践

### 配置驱动的最佳实践

**不要在模板中硬编码技能分类**：

```markdown
<!-- ❌ 不推荐：硬编码技能分类 -->
### 技术技能
{{#each skills.technical}}
- {{name}}
{{/each}}

### 语言能力
{{#each skills.language}}
- {{language}}
{{/each}}

### 软技能
{{#each skills.soft}}
- {{this}}
{{/each}}
```

```markdown
<!-- ✅ 推荐：使用配置驱动的循环 -->
{{#each skillCategories}}
### {{name}}
{{#each ../skills.[id]}}
- {{name}}
{{/each}}
{{/each}}
```

**实现方式**：
```javascript
// 在模板渲染时传入配置
const skillsConfig = await api.getSkillCategories();
const skillsData = await api.getData('skills');

const rendered = template({
  skillCategories: skillsConfig.categories,
  skills: skillsData
});
```

**不要在模板中硬编码联系字段**：

```markdown
<!-- ❌ 不推荐 -->
- 📧 {{personal.email}}
- 📱 {{personal.phone}}
- 📍 {{personal.location}}
```

```markdown
<!-- ✅ 推荐：使用配置驱动的循环 -->
{{#each contactFields}}
{{icon}} {{../personal.[id]}}
{{/each}}
```

**实现方式**：
```javascript
const contactFieldsConfig = await api.getContactFields();
const personalData = await api.getData('personal');

const rendered = template({
  contactFields: contactFieldsConfig.contactFields,
  personal: personalData
});
```

### 1. 保持简洁

```html
<!-- 推荐 -->
<div class="card p-6">
  <h3 class="text-xl font-bold mb-2">标题</h3>
  <p>内容</p>
</div>

<!-- 不推荐 -->
<div class="w-full h-auto bg-white border-2 border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
  <h3 class="text-xl font-bold mb-2 text-gray-900">标题</h3>
  <p class="text-gray-700">内容</p>
</div>
```

### 2. 使用语义化类名

```html
<!-- 推荐 -->
<div class="resume-header">
  <h1 class="resume-title">{{personal.name}}</h1>
  <p class="resume-subtitle">{{personal.title}}</p>
</div>

<!-- 不推荐 -->
<div class="mt-8 mb-4">
  <h1 class="text-4xl font-bold">{{personal.name}}</h1>
  <p class="text-xl">{{personal.title}}</p>
</div>
```

### 3. 响应式设计优先

```html
<!-- 推荐：移动优先 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 内容 -->
</div>

<!-- 不推荐：只考虑桌面 -->
<div class="grid grid-cols-3 gap-6">
  <!-- 内容 -->
</div>
```

### 4. 提取可复用配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#f59e0b'
        }
      },
      spacing: {
        section: '6rem'
      }
    }
  }
}
```

```html
<!-- 使用自定义配置 -->
<div class="py-section bg-brand-primary text-white">
  内容
</div>
```

### 5. 国际化最佳实践

#### 使用 i18n 变量而非硬编码文本

```markdown
<!-- ✅ 推荐：使用国际化变量 -->
## {{i18n.experience.section}}
{{#each experience}}
### {{company}}
**{{position}}**
...
{{/each}}

<!-- ❌ 不推荐：硬编码中文 -->
## 工作经历
{{#each experience}}
### {{company}}
...
{{/each}}
```

#### 分离简历数据和界面文本

```javascript
// ✅ 简历数据来自 data/[lang]/
{
  personal: { name: "张三", title: "高级工程师" },
  experience: [ ... ]
}

// ✅ 界面文本来自 languages/[lang].json
{
  "experience": {
    "section": "工作经历",
    "company": "公司名称",
    "position": "职位"
  }
}
```

#### 条件文本国际化

```markdown
{{#unless skills.technical}}
{{i18n.skills.empty}}
{{/unless}}

{{#if certificates}}
## {{i18n.certificates.section}}
{{/if}}
```

#### ATS模板的大写转换

```markdown
<!-- ATS友好：章节标题大写 -->
{{i18n.experience.section | uppercase}}    ← "WORK EXPERIENCE"
{{i18n.projects.section | uppercase}}      ← "PROJECTS"
{{i18n.education.section | uppercase}}     ← "EDUCATION"
```

### 6. 打印友好设计

```html
<style>
@media print {
  .no-print { display: none !important; }
  .break-page { page-break-before: always; }
  .avoid-break { page-break-inside: avoid; }
}
</html>

<div class="no-print">
  <button>打印按钮</button>
</div>

<div class="avoid-break">
  <p>重要内容，不分页</p>
</div>
```

### 7. 性能优化

```javascript
// tailwind.config.js
module.exports = {
  purge: [
    './templates/**/*.html',
    './public/**/*.html'
  ],
  // ... 其他配置
}
```

### 7. 版本控制

```json
// config.json
{
  "version": "1.2.0",
  "changelog": [
    "1.2.0 - 添加暗色模式支持",
    "1.1.0 - 优化响应式布局",
    "1.0.0 - 初始版本"
  ]
}
```

### 8. 文档化

```html
<!--
  模板：创意设计师
  作者：Design Team
  版本：1.0.0
  最后更新：2026-03-18
-->
```

---

## 附录

### Tailwind CSS 常用类速查表

#### 布局
- `container` - 容器
- `flex` - Flexbox
- `grid` - Grid
- `block`, `inline-block`, `inline` - 显示类型
- `hidden` - 隐藏

#### Flexbox
- `flex-row`, `flex-col` - 方向
- `flex-wrap`, `flex-nowrap` - 换行
- `justify-start`, `justify-center`, `justify-end`, `justify-between` - 主轴对齐
- `items-start`, `items-center`, `items-end` - 交叉轴对齐
- `flex-1`, `flex-auto`, `flex-none` - 弹性

#### Grid
- `grid-cols-1` 到 `grid-cols-12` - 列数
- `grid-rows-1` 到 `grid-rows-6` - 行数
- `gap-0` 到 `gap-8` - 间距

#### 间距
- `p-0` 到 `p-8`, `p-12`, `p-16` - 内边距
- `px-`, `py-`, `pt-`, `pr-`, `pb-`, `pl-` - 方向内边距
- `m-0` 到 `m-8`, `m-12`, `m-16` - 外边距
- `mx-`, `my-`, `mt-`, `mr-`, `mb-`, `ml-` - 方向外边距

#### 文本
- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl` - 字体大小
- `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold` - 字重
- `text-left`, `text-center`, `text-right` - 对齐
- `text-gray-900` 到 `text-gray-100` - 文本颜色

#### 背景
- `bg-white`, `bg-gray-100` 到 `bg-gray-900` - 背景色
- `bg-gradient-to-r`, `bg-gradient-to-b` - 渐变

#### 边框
- `border`, `border-2`, `border-4`, `border-8` - 边框宽度
- `border-t`, `border-r`, `border-b`, `border-l` - 方向边框
- `border-gray-200` 到 `border-gray-800` - 边框颜色
- `rounded`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full` - 圆角

#### 阴影
- `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` - 阴影

#### 响应式前缀
- `sm:` - ≥ 640px
- `md:` - ≥ 768px
- `lg:` - ≥ 1024px
- `xl:` - ≥ 1280px

#### 状态
- `hover:` - 悬停
- `focus:` - 聚焦
- `active:` - 激活

---

## 联系与支持

如有问题或建议，请通过以下方式联系：
- GitHub Issues
- Email: support@example.com

---

**最后更新**: 2026-03-18
**文档版本**: 1.0.0
