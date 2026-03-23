const fs = require('fs').promises;
const path = require('path');

const LANGUAGES_DIR = path.join(__dirname, '../../languages');
const DATA_DIR = path.join(__dirname, '../../data');

class LanguageService {
  async getLanguageList() {
    const indexPath = path.join(LANGUAGES_DIR, 'index.json');
    const data = await fs.readFile(indexPath, 'utf8');
    return JSON.parse(data);
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

  async getResumeData(langCode, module) {
    const langDir = path.join(DATA_DIR, langCode);
    const filePath = path.join(langDir, `${module}.json`);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {};
      }
      throw error;
    }
  }

  async saveResumeData(langCode, module, data) {
    const langDir = path.join(DATA_DIR, langCode);
    await fs.mkdir(langDir, { recursive: true });

    const filePath = path.join(langDir, `${module}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getLanguageStatus(langCode) {
    const modules = ['personal', 'experience', 'projects', 'education', 'certificates', 'skills'];
    const status = {};

    for (const module of modules) {
      const data = await this.getResumeData(langCode, module);
      const isEmpty = Object.keys(data).length === 0;
      status[module] = { exists: !isEmpty, data };
    }

    return status;
  }
}

module.exports = new LanguageService();
