const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

class VersionService {
  async saveCurrentVersion(langCode, module) {
    const langDir = path.join(DATA_DIR, langCode);
    const filePath = path.join(langDir, `${module}.json`);

    try {
      const currentData = await fs.readFile(filePath, 'utf8');
      const versionsPath = path.join(langDir, `.${module}.versions.json`);

      let versions = [];
      try {
        versions = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
      } catch (error) {}

      versions.push({
        id: `v${Date.now()}`,
        timestamp: new Date().toISOString(),
        data: JSON.parse(currentData)
      });

      if (versions.length > 10) {
        versions = versions.slice(-10);
      }

      await fs.writeFile(versionsPath, JSON.stringify(versions, null, 2), 'utf8');
    } catch (error) {}
  }

  async getLatestVersion(langCode, module) {
    const versionsPath = path.join(DATA_DIR, langCode, `.${module}.versions.json`);

    try {
      const versions = JSON.parse(await fs.readFile(versionsPath, 'utf8'));
      return versions[versions.length - 1] || null;
    } catch (error) {
      return null;
    }
  }

  async compareVersions(langCode, module, newData) {
    const latestVersion = await this.getLatestVersion(langCode, module);

    if (!latestVersion) {
      return {
        hasChanges: Object.keys(newData).length > 0,
        changes: []
      };
    }

    const oldData = latestVersion.data;
    const changes = [];

    this.deepCompare(oldData, newData, '', changes);

    return {
      hasChanges: changes.length > 0,
      changes: changes,
      oldVersion: latestVersion,
      newVersion: {
        id: `v${Date.now()}`,
        timestamp: new Date().toISOString(),
        data: newData
      }
    };
  }

  deepCompare(oldObj, newObj, path, changes) {
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
      if (oldObj.length !== newObj.length) {
        changes.push({
          type: 'array_length',
          path: path,
          old: oldObj.length,
          new: newObj.length
        });
      }

      const maxLength = Math.max(oldObj.length, newObj.length);
      for (let i = 0; i < maxLength; i++) {
        this.deepCompare(oldObj[i], newObj[i], `${path}[${i}]`, changes);
      }
      return;
    }

    if (typeof oldObj === 'object' && oldObj !== null &&
        typeof newObj === 'object' && newObj !== null) {
      const keys = new Set([
        ...Object.keys(oldObj),
        ...Object.keys(newObj)
      ]);

      keys.forEach(key => {
        const oldVal = oldObj[key];
        const newVal = newObj[key];

        if (!(key in oldObj) && key in newObj) {
          changes.push({
            type: 'added',
            path: `${path}.${key}`,
            new: newVal
          });
        } else if (key in oldObj && !(key in newObj)) {
          changes.push({
            type: 'removed',
            path: `${path}.${key}`,
            old: oldVal
          });
        } else if (typeof oldVal === 'object' && typeof newVal === 'object') {
          this.deepCompare(oldVal, newVal, `${path}.${key}`, changes);
        } else if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          changes.push({
            type: 'modified',
            path: `${path}.${key}`,
            old: oldVal,
            new: newVal
          });
        }
      });
      return;
    }

    if (JSON.stringify(oldObj) !== JSON.stringify(newObj)) {
      changes.push({
        type: 'modified',
        path: path,
        old: oldObj,
        new: newObj
      });
    }
  }

  async cleanupOldVersions(langCode, module, keepCount = 10) {
    const versionsPath = path.join(DATA_DIR, langCode, `.${module}.versions.json`);

    try {
      const versions = JSON.parse(await fs.readFile(versionsPath, 'utf8'));

      if (versions.length > keepCount) {
        const trimmedVersions = versions.slice(-keepCount);
        await fs.writeFile(
          versionsPath,
          JSON.stringify(trimmedVersions, null, 2),
          'utf8'
        );
      }
    } catch (error) {}
  }
}

module.exports = new VersionService();
