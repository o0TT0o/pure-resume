# Pure Resume System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://www.w3.org/html/)

## 📖 About

A resume is a highly personalized form of self-expression. No single resume system can satisfy everyone's needs—those that exist are likely paid solutions.

I've tried various approaches to maintain my resume: online web-based editors, desktop applications, Python conversion tools, and more. But each method had its limitations—either restricted by platform constraints or overly complex workflows that turned simple resume maintenance into an arduous task.

Even after painstakingly exporting a beautiful PDF, you might hear from HR: *"Can you also provide a Word version?"* 😩

**But now, AI is here! What can't we achieve?** 🚀

My vision is simple yet powerful: **maintain a single source of truth** and adapt to any resume requirement instantly—web version, PDF, Word, and multi-language support. (Future plans include direct integration with company recruitment APIs, automatic job matching, and more!)

Whether editing from the frontend or modifying directly in the backend, keep your resume updated whenever you complete a new project, start a new job, or discover an inspiring template. Stay ready, always! ✨

## 🎯 Core Features

- **✍️ Multi-format Export**: Generate Web, PDF, and Word versions with one click
- **🌍 Multi-language Support**: Easily switch between different language versions
- **💾 Dual Editing**: Frontend visual editing + direct backend modifications
- **🎨 Template System**: Flexible template system with custom theme support
- **🔄 Real-time Preview**: View changes instantly while editing
- **📱 Responsive Design**: Perfectly adapted for all devices

## 🚀 Quick Start

### Requirements

- Node.js >= 14
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/resume-system.git
cd resume-system

# Install dependencies
npm install

# Start the development server
npm start
```

Visit `http://localhost:3000` to get started.

## 📁 Project Structure

```
Resume/
├── public/              # Frontend resources
│   ├── index.html       # Main entry
│   └── js/              # JavaScript modules
│       ├── core/        # Core logic & state management
│       ├── editor/      # Editor components
│       └── version/     # Version control
├── server/              # Backend server
├── data/                # Resume data files
└── templates/           # Resume templates
```

## 💡 Usage Guide

### Frontend Editing

1. Select language and template
2. Choose the module to edit (Personal Info, Work Experience, Projects, etc.)
3. Make changes in the editor
4. Preview changes in real-time
5. Save your changes

### Master Mode

Modify JSON files directly in the `data/` directory. The frontend will automatically sync updates.

### Export Resume

Click the export button and select your preferred format (PDF/Word/Web).

## 🔧 Tech Stack

- **Frontend**: HTML5, JavaScript (ES6+), CSS3
- **Backend**: Node.js, Express
- **Data Storage**: JSON files
- **Export**: PDF.js, html-docx-js

## 🛠️ Roadmap

- [ ] God Knows

## 🤝 Contributing

Issues and Pull Requests are not that welcome! ; )

## 📝 License

MIT License

---

**P.S.** Although this project doesn't integrate AI interfaces directly, using AI to maintain this project is incredibly friendly—including code logic, frontend template styling, resume translation, and feature extensions. The possibilities are endless! 🌟
**P.P.S** My Native Language is Chinese, so code comments are in Chinese. But AI is helpful on translatioin jobs :)
