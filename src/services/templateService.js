const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');
const { marked } = require('marked');

const TEMPLATES_DIR = path.join(__dirname, '../../templates');
const LANGUAGES_DIR = path.join(__dirname, '../../languages');

// 注册自定义 Handlebars helpers
handlebars.registerHelper('times', function(n, options) {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += options.fn(this);
  }
  return result;
});

handlebars.registerHelper('subtract', function(a, b) {
  return a - b;
});

class TemplateService {
  async getTemplateList() {
    const templateDirs = await fs.readdir(TEMPLATES_DIR);
    const templates = [];

    for (const dir of templateDirs) {
      try {
        const configPath = path.join(TEMPLATES_DIR, dir, 'config.json');
        const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
        templates.push(config);
      } catch (error) {
        console.error(`Failed to load template ${dir}:`, error);
      }
    }

    return templates;
  }

  async getTemplate(templateId) {
    const configPath = path.join(TEMPLATES_DIR, templateId, 'config.json');
    const contentPath = path.join(TEMPLATES_DIR, templateId, 'content.md');
    const templatePath = path.join(TEMPLATES_DIR, templateId, 'template.html');

    const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
    const content = await fs.readFile(contentPath, 'utf8');
    const template = await fs.readFile(templatePath, 'utf8');

    return { config, content, template };
  }

  async getLanguagePack(langCode) {
    const langPath = path.join(LANGUAGES_DIR, langCode, 'ui.json');
    try {
      const data = await fs.readFile(langPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  preprocessContent(content, languagePack) {
    let processedContent = content;
    const i18nRegex = /\{\{i18n\.([a-zA-Z0-9_.]+)\}\}/g;

    processedContent = processedContent.replace(i18nRegex, (match, keyPath) => {
      const keys = keyPath.split('.');
      let value = languagePack;

      for (const key of keys) {
        value = value?.[key];
      }

      return value || match;
    });

    return processedContent;
  }

  async renderTemplate(templateId, data, langCode = 'zh-CN') {
    const { template, content } = await this.getTemplate(templateId);
    const languagePack = await this.getLanguagePack(langCode);

    const preprocessedContent = this.preprocessContent(content, languagePack);
    const parsedContent = marked(preprocessedContent);

    const compiledTemplate = handlebars.compile(template);

    return compiledTemplate({
      ...data,
      i18n: languagePack,
      langCode: langCode,
      content: parsedContent
    });
  }

  async applyTemplate(templateId, data, langCode = 'zh-CN') {
    const { config } = await this.getTemplate(templateId);
    const html = await this.renderTemplate(templateId, data, langCode);
    
    // 注入 Tailwind CSS 到 HTML 中
    const htmlWithTailwind = `
<!DOCTYPE html>
<html lang="${langCode}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      @page { margin: 0.5cm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
    
    return { html: htmlWithTailwind, config };
  }
}

module.exports = new TemplateService();
