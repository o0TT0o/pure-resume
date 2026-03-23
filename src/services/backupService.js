const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');

const DATA_DIR = path.join(__dirname, '../../data');
const BACKUP_DIR = path.join(__dirname, '../../backup');

class BackupService {
  async createBackup() {
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.zip`);

    return new Promise((resolve, reject) => {
      const output = require('fs').createWriteStream(backupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        resolve(backupPath);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(DATA_DIR, false);
      archive.finalize();
    });
  }

  async listBackups() {
    try {
      const files = await fs.readdir(BACKUP_DIR);
      const backups = [];

      for (const file of files) {
        if (file.endsWith('.zip')) {
          const filePath = path.join(BACKUP_DIR, file);
          const stats = await fs.stat(filePath);
          backups.push({
            name: file,
            path: filePath,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
          });
        }
      }

      return backups.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      return [];
    }
  }

  async deleteBackup(filename) {
    const backupPath = path.join(BACKUP_DIR, filename);
    await fs.unlink(backupPath);
  }

  async restoreBackup(filename) {
    const backupPath = path.join(BACKUP_DIR, filename);
    const extractDir = path.join(__dirname, '../../temp-restore');

    await fs.mkdir(extractDir, { recursive: true });

    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    await execAsync(`unzip -o "${backupPath}" -d "${extractDir}"`);

    const restorePath = path.join(extractDir, 'data');

    const restoreRecursive = async (source, dest) => {
      const entries = await fs.readdir(source, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = path.join(source, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          await fs.mkdir(destPath, { recursive: true });
          await restoreRecursive(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    };

    await restoreRecursive(restorePath, DATA_DIR);

    await fs.rm(extractDir, { recursive: true, force: true });
  }
}

module.exports = new BackupService();
