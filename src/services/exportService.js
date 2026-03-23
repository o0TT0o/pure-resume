const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

class ExportService {
  async exportToPDF(html) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true
    });
    await browser.close();
    return pdf;
  }

  async exportToWord(html, langCode = 'zh-CN') {
    const tempDir = path.join(__dirname, '../../uploads');
    await fs.mkdir(tempDir, { recursive: true });

    const htmlFile = path.join(tempDir, `temp_${Date.now()}.html`);
    const docxFile = path.join(tempDir, `resume_${Date.now()}.docx`);

    await fs.writeFile(htmlFile, html, 'utf8');

    try {
      await execAsync(`pandoc -f html -t docx -o "${docxFile}" "${htmlFile}"`);
      const docxBuffer = await fs.readFile(docxFile);

      await fs.unlink(htmlFile);
      await fs.unlink(docxFile);

      return docxBuffer;
    } catch (error) {
      await fs.unlink(htmlFile).catch(() => {});
      throw new Error(`Word导出失败: ${error.message}`);
    }
  }
}

module.exports = new ExportService();
