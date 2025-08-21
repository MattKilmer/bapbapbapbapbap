# BapBapBapBapBap

A modern audio-visual trigger application built with Next.js 15 and PIXI.js. Create an immersive 4×4 grid of interactive zones that trigger unique particle-based animations paired with custom audio samples.

![BapBapBapBapBap Demo](https://via.placeholder.com/800x400/000000/FFFFFF?text=BapBapBapBapBap%20Demo)

## ✨ Features

### 🎨 Dynamic Particle Animations
- **16 unique animations** with advanced particle systems
- **Swarm**: Flocking behavior with boids algorithm
- **Mandala**: Multi-layered intricate geometric patterns  
- **Nebula**: 3D orbital particle system with depth simulation
- **Waves**: Fluid particle motion with organic flow
- **Crystal**: Hexagonal formation with realistic shatter physics
- **Matrix**: Abstract multi-character streams with cyberpunk colors
- **And 10 more** stunning visual effects

### 🔊 Audio Engine
- Upload custom audio samples for each zone
- Configurable gain control per sample
- Cross-browser audio playback with Tone.js integration
- Random sample selection for variety

### ⚙️ Admin Interface
- Intuitive web-based configuration
- Upload audio files via drag-and-drop
- Real-time animation parameter tuning
- Zone activation/deactivation controls
- Audio preview and management

### 🎯 Interactive Experience
- **4×4 touch grid** (16 zones total)
- Invisible interface for clean aesthetics
- Responsive design for all screen sizes
- Real-time audio-visual synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MattKilmer/bapbapbapbapbap.git
   cd bapbapbapbapbap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/bapbapbapbapbap"
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
   
   # Admin Authentication
   ADMIN_SECRET="your_secure_admin_password"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Main app: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📖 Usage

### Setting Up Zones

1. Navigate to the admin panel at `/admin`
2. Select a zone to configure
3. Choose an animation type from the dropdown
4. Upload audio samples (MP3, WAV, etc.)
5. Adjust gain levels and animation parameters
6. Mark zones as active when ready

### Creating Custom Animations

Add new animations by creating files in `src/lib/animations/`:

```typescript
import { Graphics, Container } from 'pixi.js';
import type { Anim } from './index';

export const myAnimation: Anim = {
  key: 'myAnimation',
  name: 'My Animation',
  schema: { 
    speed: { type: 'number', default: 1 },
    lifeMs: { type: 'number', default: 2000 } 
  },
  run: ({ stage, x, y, cfg }) => {
    // Your animation logic here
    const container = new Container();
    // ... create graphics and animations
    stage.addChild(container);
  }
};
```

Then register it in `src/lib/animations/index.ts`.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Graphics**: PIXI.js for high-performance 2D rendering
- **Audio**: Tone.js + HTML5 Audio API
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Vercel Blob for audio file uploads
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🏗️ Architecture

```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # Admin interface
│   ├── api/            # API endpoints
│   └── page.tsx        # Main application
├── components/         # React components
│   ├── Admin/          # Admin-specific components
│   ├── CanvasStage.tsx # PIXI.js canvas wrapper
│   └── GridOverlay.tsx # Touch interaction layer
├── lib/
│   ├── animations/     # Animation definitions
│   ├── audio/          # Audio engine
│   └── db.ts          # Database utilities
└── prisma/
    ├── schema.prisma   # Database schema
    └── seed.ts         # Initial data
```

## 🎮 API Reference

### Zones
- `GET /api/zones` - List all zones
- `GET /api/zones/[id]` - Get zone details
- `POST /api/zones/[id]` - Update zone configuration

### Audio Samples
- `POST /api/zones/[id]/samples` - Upload audio sample
- `DELETE /api/samples/[id]` - Delete audio sample
- `POST /api/upload-token` - Upload file to blob storage

### Configuration
- `GET /api/config` - Get full application configuration
- `GET /api/animations` - List available animations

## 🎨 Animation System

The animation system is built on PIXI.js and supports:

- **Particle Physics**: Flocking, orbital mechanics, fluid dynamics
- **Multi-layered Rendering**: Depth simulation and layered effects
- **Dynamic Parameters**: Real-time configuration via admin panel
- **Performance Optimization**: Efficient cleanup and memory management
- **Extensible Architecture**: Easy to add new animation types

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Set up Vercel Postgres** (or external PostgreSQL)
4. **Enable Vercel Blob** for file storage
5. **Deploy automatically** on every push to main

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PIXI.js** for incredible 2D graphics performance
- **Vercel** for seamless deployment and hosting
- **Tone.js** for web audio capabilities
- **Next.js** for the amazing React framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/MattKilmer/bapbapbapbapbap/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MattKilmer/bapbapbapbapbap/discussions)
- **Email**: [your-email@example.com](mailto:your-email@example.com)

---

Built with ❤️ by [MattKilmer](https://github.com/MattKilmer)

*Transform sound into visual magic* ✨
