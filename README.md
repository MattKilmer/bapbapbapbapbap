# BapBapBapBapBap

An interactive audio-visual trigger application that transforms touch into immersive particle animations and sound. Built with Next.js 15 and PIXI.js.

## 🚀 Try It Out

# **-> [bapbapbapbapbap.com](https://www.bapbapbapbapbap.com/)**

Experience the interactive 4×4 grid. Tap anywhere to trigger unique animations paired with custom audio samples.

---

## 📚 Complete Documentation

| **Quick Links** | **Description** |
|-----------------|-----------------|
| **[🎮 User Guide](./docs/user-guide.md)** | How to use the interactive experience |
| **[⚙️ Admin Guide](./docs/admin-guide.md)** | Managing zones, samples, and settings |
| **[🚀 Installation](./docs/installation.md)** | Local development setup |
| **[🔗 API Reference](./docs/api-reference.md)** | Complete API documentation |
| **[🎨 Animation System](./docs/animations.md)** | Creating custom animations |
| **[🛠️ Troubleshooting](./docs/troubleshooting.md)** | Common issues and solutions |

---

## ✨ Features Overview

### 🎨 **16 Unique Animations**
Particle-based effects including burst, ripple, mandala, nebula, waves, crystal, matrix, and more.

### 🔊 **Audio Engine** 
Upload custom samples with configurable gain. Cross-browser playback with random selection.

### ⚙️ **Admin Interface**
Web-based configuration with drag-and-drop uploads and real-time parameter tuning.

### 🎯 **Interactive Grid**
4×4 touch zones (16 total) with invisible UI for clean aesthetics. Responsive design.

---

## 🚀 Quick Start

**Prerequisites:** Node.js 18+, PostgreSQL, Vercel account

```bash
# 1. Clone and install
git clone https://github.com/MattKilmer/bapbapbapbapbap.git
cd bapbapbapbapbap
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your database and Vercel Blob credentials

# 3. Set up database
npx prisma db push
npx prisma db seed

# 4. Start development
npm run dev
```

**Access:** [http://localhost:3000](http://localhost:3000) (main app) • [http://localhost:3000/admin](http://localhost:3000/admin) (admin panel)

**📖 [→ Detailed Installation Guide](./docs/installation.md)**

---

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 18, TypeScript  
**Graphics:** PIXI.js for high-performance 2D rendering  
**Audio:** Tone.js + HTML5 Audio API  
**Database:** PostgreSQL with Prisma ORM  
**Storage:** Vercel Blob for audio files  
**Styling:** Tailwind CSS  
**Deployment:** Vercel  

---

## 🤝 Contributing

We welcome contributions! Please see the **[Installation Guide](./docs/installation.md)** and **[Animation System](./docs/animations.md)** for development details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🆘 Support

- **[🛠️ Troubleshooting Guide](./docs/troubleshooting.md)** - Common issues and solutions
- **[GitHub Issues](https://github.com/MattKilmer/bapbapbapbapbap/issues)** - Report bugs or request features
- **[GitHub Discussions](https://github.com/MattKilmer/bapbapbapbapbap/discussions)** - Ask questions and share ideas
- **Email:** mvkilmer@hotmail.com

---

**Built with ❤️ by [MattKilmer](https://github.com/MattKilmer) • Transform sound into visual magic** ✨
