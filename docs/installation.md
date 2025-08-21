# Installation Guide

Complete setup instructions for running BapBapBapBapBap locally or in production.

## 🧰 Prerequisites

### Required Software
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **PostgreSQL** - Database server ([Installation Guide](https://www.postgresql.org/download/))

### Development Tools (Recommended)
- **VS Code** - Code editor with great TypeScript support
- **Postman** - API testing tool
- **pgAdmin** - PostgreSQL database management

### Accounts Needed
- **GitHub Account** - For cloning the repository
- **Vercel Account** - For deployment and blob storage
- **PostgreSQL Database** - Local or cloud instance

## 📥 Project Setup

### 1. Clone Repository
```bash
git clone https://github.com/MattKilmer/bapbapbapbapbap.git
cd bapbapbapbapbap
```

### 2. Install Dependencies
```bash
npm install
```

This installs all required packages including:
- Next.js 15 with Turbopack
- PIXI.js for graphics
- Prisma for database
- Tone.js for audio
- Tailwind CSS for styling

### 3. Environment Configuration

#### Create Environment File
```bash
cp .env.example .env.local
```

#### Configure Variables
Edit `.env.local` with your settings:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/bapbapbapbapbap"

# Vercel Blob Storage (for audio files)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"

# Admin Panel Security
ADMIN_SECRET="your_secure_admin_password_here"

# Optional: Production URL
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

#### Environment Variable Details

**DATABASE_URL**
- Format: `postgresql://user:password@host:port/database`
- Example: `postgresql://myuser:mypass@localhost:5432/bapbapbapbapbap`
- Create database first: `createdb bapbapbapbapbap`

**BLOB_READ_WRITE_TOKEN**
- Get from Vercel dashboard → Storage → Blob
- Used for audio file uploads
- Create token with read/write permissions

**ADMIN_SECRET**
- Strong password for admin panel access
- Minimum 12 characters recommended
- Include letters, numbers, symbols

## 🗄️ Database Setup

### 1. Create Database
```bash
# Using createdb command
createdb bapbapbapbapbap

# Or using psql
psql -U postgres
CREATE DATABASE bapbapbapbapbap;
\q
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Apply Database Schema
```bash
npx prisma db push
```

This creates the required tables:
- `Zone` - Interactive grid zones
- `Sample` - Audio file metadata
- `Preset` - Configuration presets
- `Settings` - Global application settings

### 4. Seed Initial Data
```bash
npx prisma db seed
```

Creates:
- 16 zones (4×4 grid) with default configurations
- Sample animation assignments
- Default global settings

### 5. Verify Database Setup
```bash
npx prisma studio
```
Opens web interface to browse database tables.

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

The application starts on `http://localhost:3000`:
- **Main App**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`

### Production Build
```bash
npm run build
npm start
```

Builds optimized version and starts production server.

## 🔧 Vercel Blob Setup

### 1. Create Vercel Account
Sign up at [vercel.com](https://vercel.com) if you don't have an account.

### 2. Create Blob Store
1. Go to Vercel Dashboard
2. Select your project (or create one)
3. Navigate to Storage tab
4. Click "Create Database" → "Blob"
5. Name your store (e.g., "bapbapbapbap-audio")

### 3. Get Access Token
1. In Blob storage settings
2. Click "Create Token"
3. Select "Read and Write" permissions
4. Copy token to `BLOB_READ_WRITE_TOKEN` in `.env.local`

### 4. Test Upload
Upload a test audio file through the admin panel to verify setup.

## 🧪 Verification & Testing

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Main Application
- Visit `http://localhost:3000`
- Should see welcome message
- Tap anywhere to trigger default animations
- Audio may not work until samples are uploaded

### 3. Test Admin Panel
- Visit `http://localhost:3000/admin`
- Enter your admin password
- Should see 16-zone grid
- Try uploading an audio file

### 4. Database Verification
```bash
npx prisma studio
```
- Check that zones exist (16 entries)
- Verify settings table has global scale
- Confirm no critical errors

### 5. Feature Testing
- **Animations**: Verify all 16 animation types work
- **Audio Upload**: Test file upload in admin panel
- **Global Scale**: Adjust animation scale setting
- **Zone Configuration**: Change animations per zone

## 🐛 Common Installation Issues

### Node.js Version Issues
**Error**: `Node.js version not supported`
**Solution**: 
```bash
node --version  # Should be 18.0.0 or higher
nvm install 18  # If using nvm
```

### Database Connection Issues
**Error**: `Can't connect to database`
**Solution**:
1. Verify PostgreSQL is running: `pg_ctl status`
2. Check database exists: `psql -l | grep bapbapbapbapbap`
3. Verify connection string in `.env.local`
4. Test connection: `psql $DATABASE_URL`

### Prisma Issues
**Error**: `Schema drift detected` or `Prisma client not generated`
**Solution**:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Vercel Blob Issues
**Error**: `Blob upload failed`
**Solution**:
1. Verify `BLOB_READ_WRITE_TOKEN` is correct
2. Check token permissions (read/write)
3. Test with smaller files first
4. Check Vercel account limits

### Port Already in Use
**Error**: `Port 3000 is already in use`
**Solution**:
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Permission Issues
**Error**: `EACCES: permission denied`
**Solution**:
```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

## 🔒 Security Setup

### Admin Password
Choose a strong admin password:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Avoid common words or personal information

### Database Security
- Use dedicated database user with limited permissions
- Enable SSL connections for production
- Regularly backup database
- Monitor access logs

### Environment Variables
- Never commit `.env.local` to git
- Use different secrets for production
- Rotate tokens periodically
- Use secure secret management in production

## 🚀 Development Workflow

### Recommended Setup
1. **Install recommended VS Code extensions**:
   - TypeScript
   - Prisma
   - Tailwind CSS
   - ESLint

2. **Configure Git hooks** (optional):
   ```bash
   npm install -D husky
   npx husky install
   ```

3. **Set up debugging**:
   - Browser dev tools for frontend
   - VS Code debugger for backend
   - Prisma studio for database

### Code Structure
```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # Admin panel pages
│   ├── api/            # API endpoints
│   └── page.tsx        # Main application
├── components/         # React components
├── lib/               # Shared utilities
│   ├── animations/    # Animation definitions
│   ├── audio/         # Audio engine
│   └── db.ts         # Database client
└── styles/           # CSS and Tailwind
```

## 📚 Next Steps

After successful installation:

1. **Read the User Guide** - Understand how the app works
2. **Explore Admin Panel** - Upload audio and configure zones  
3. **Check API Documentation** - Learn about available endpoints
4. **Review Animation System** - Understand how to create custom animations
5. **Plan Deployment** - Prepare for production deployment

## 🆘 Getting Help

### Documentation
- **User Guide**: How to use the application
- **Admin Guide**: Managing content and settings
- **API Reference**: Complete API documentation
- **Troubleshooting**: Common issues and solutions

### Community Support
- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: Ask questions and share ideas
- **Email Support**: mvkilmer@hotmail.com

---

**Installation complete? Try the [Quick Start Guide](./quickstart.md) to get creating immediately!** 🚀