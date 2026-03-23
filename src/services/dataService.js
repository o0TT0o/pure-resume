const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

class DataService {
  async read(langCode, module) {
    const filePath = path.join(DATA_DIR, langCode, `${module}.json`);
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

  async write(langCode, module, data) {
    const langDir = path.join(DATA_DIR, langCode);
    await fs.mkdir(langDir, { recursive: true });

    const filePath = path.join(langDir, `${module}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async updateRecord(langCode, module, id, updates) {
    const currentData = await this.read(langCode, module);
    
    if (!Array.isArray(currentData)) {
      throw new Error('该模块数据不是数组格式，不支持单条记录更新');
    }

    const index = currentData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('未找到指定的记录');
    }

    // 合并更新
    currentData[index] = { ...currentData[index], ...updates };
    
    await this.write(langCode, module, currentData);
    return currentData[index];
  }

  async deleteRecord(langCode, module, id) {
    const currentData = await this.read(langCode, module);
    
    if (!Array.isArray(currentData)) {
      throw new Error('该模块数据不是数组格式，不支持单条记录删除');
    }

    const index = currentData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('未找到指定的记录');
    }

    const deletedRecord = currentData[index];
    currentData.splice(index, 1);
    
    await this.write(langCode, module, currentData);
    return deletedRecord;
  }

  async readConfig(filename) {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  }

  async writeConfig(filename, data) {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}

module.exports = new DataService();
