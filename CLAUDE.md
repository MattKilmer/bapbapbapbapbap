# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build for production (includes Prisma generate/push and Next.js build)
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

### Database Operations
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npx prisma db execute --file migration.sql` - Execute raw SQL migrations
- `npx prisma studio` - Open Prisma Studio for database management

### Environment Setup
- Copy `.env.example` to `.env.local` and configure:
  - `DATABASE_URL` - PostgreSQL connection string
  - `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
  - `NEXTAUTH_SECRET` - NextAuth.js secret key
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
  - `NEXTAUTH_URL` - Base URL for NextAuth callbacks

## Architecture Overview

This is a **multi-user interactive audio-visual soundboard platform** built with Next.js 15, featuring user authentication, personal soundboard management, sharing capabilities, and community discovery.

### Current Status (Latest Updates)

**✅ PRODUCTION READY - Multi-User Platform Complete + Mobile Optimized**
- Full user authentication system (Google OAuth + credentials)
- Personal dashboard with soundboard management
- Public/private soundboard sharing with copy-to-clipboard links
- Explore page for discovering public soundboards
- Zone positioning system (consistent 1-16 display)
- Dark theme UI updates (bg-gray-950 throughout)
- **Mobile-responsive UI** with proper button scaling and logo sizing
- **Clean console output** - removed verbose debug logging
- All TypeScript compilation errors resolved
- Successfully deployed to production

**Latest Session Updates:**
- **🚀 CRITICAL MOBILE PERFORMANCE OPTIMIZATION (2025-08-26)** - Comprehensive fix for slow mobile animations
- **Canvas Sizing Bug Fix** - Resolved critical canvas oversizing issue (viewport vs container mismatch)
- **Mobile-Optimized PIXI.js** - Disabled antialias, low-power mode, proper mobile detection
- **Animation Performance Scaling** - Reduced particle counts 6x on mobile, simplified calculations
- **GPU Overdraw Elimination** - Canvas now exactly matches container dimensions
- **Previous Updates:**
  - Universal Navigation Bar Implementation - Added Navigation component to all application views
  - PIXI.js Grid Positioning & Error Fixes - Fixed grid positioning and animation cleanup
  - Logo Positioning & Navigation - Applied offsets and clickable logos with hover effects
  - CTA for Non-Signed Users - Added prominent call-to-action on explore page
  - Soundboard Name & Description Editing - Added inline editing with pencil icons
  - UI Polish - Made dashboard sign out button subtle, added cursor pointer feedback

### Core System Architecture

**Frontend Architecture:**
- Next.js 15 with App Router and React 19
- PIXI.js for high-performance 2D particle rendering via `CanvasStage` component
- Audio engine using HTML5 Audio API with gain controls
- Tailwind CSS with consistent dark theme (bg-gray-950) and path alias `@/*` pointing to `./src/*`

**Multi-User System:**
- NextAuth.js with Google OAuth and email/password authentication
- User-owned soundboards with CRUD operations
- Role-based permissions (USER, ARTIST, ADMIN)
- Public/private visibility controls
- Shareable links for all soundboards (private = hidden from explore only)

**Database Schema (Updated):**
```prisma
User {
  id, email, name, password, role
  soundboards Soundboard[]
}

Soundboard {
  id, name, description, isPublic(default: true), userId
  globalScale, plays, likes, slug
  zones Zone[]
}

Zone {
  id, position(1-16), soundboardId
  animationKey, animationCfg, isActive
  samples Sample[]
}

Sample {
  id, zoneId, url, volume, name
}
```

**URL Structure:**
- `/` - Default landing/main soundboard experience
- `/auth/signin` & `/auth/signup` - Authentication pages
- `/dashboard` - Personal soundboard management
- `/explore` - Public soundboard discovery
- `/play/[id]` - Specific soundboard playback
- `/soundboard/new` - Create new soundboard
- `/soundboard/[id]/edit` - Edit soundboard (owner only)

### Key Features Implemented

**User Management:**
- Google OAuth integration with fallback to email/password
- Protected routes and session management
- User dashboard with soundboard list
- Delete soundboard functionality with confirmation

**Soundboard System:**
- Create, edit, delete personal soundboards
- Public by default with private option (hidden from explore)
- Copy-to-clipboard sharing for all soundboards
- Zone positioning ensures consistent 1-16 labeling
- Upload and manage audio samples per zone
- Animation configuration per zone

**UI/UX Improvements:**
- Consistent dark theme (bg-gray-950) throughout
- Responsive navigation with authentication state
- Loading states and user feedback
- Clickable public/private status toggles
- Clean card-based layouts for soundboard lists

**API Architecture:**
- RESTful endpoints for all CRUD operations
- Proper authentication middleware
- Zone management with position-based ordering
- File upload handling with Vercel Blob integration

### Key Components

**Authentication (`src/lib/auth-config.ts`):**
- NextAuth.js configuration with multiple providers
- Session management with JWT tokens
- Role-based access control

**Database Models:**
- Multi-tenant soundboard system
- Foreign key relationships with cascade deletes
- Unique constraints for zone positioning

**Navigation (`src/components/Navigation.tsx`):**
- Responsive navigation bar
- Authentication state integration
- Logo and branding

**Copy Functionality (`src/components/CopyLinkButton.tsx`):**
- Reusable clipboard integration
- Browser compatibility with fallbacks
- Visual feedback for successful copies

### Recent Fixes & Improvements

**Production Deployment Fixes:**
- Resolved Prisma seed file TypeScript errors
- Fixed implicit `any` type errors in API routes
- Corrected NextAuth configuration issues
- Cleaned up unused imports and variables
- Fixed Google OAuth redirect URI mismatch (added www domain support)

**Mobile UI Responsiveness (Latest):**
- Logo sizing: responsive text-lg sm:text-2xl for mobile optimization
- Navigation buttons: smaller padding, abbreviated text on mobile
- Dashboard cards: stack buttons vertically on mobile, show icons only
- Explore page: responsive button layout with mobile-friendly sizing
- CopyLinkButton: mobile-responsive padding and typography
- Added whitespace-nowrap and flex constraints to prevent button squishing

**Authentication & API Security (Latest):**
- **Fixed critical audio upload bug** that was causing 405 errors in production
- Removed `/api/upload-token`, `/api/zones/*`, and `/api/samples/*` from admin-only middleware
- Added NextAuth session authentication to all soundboard editing endpoints:
  - `/api/upload-token` - File upload with user authentication
  - `/api/zones/[id]/samples` - Adding audio samples to zones
  - `/api/zones/[id]` - Updating zone properties (animation, etc.)
  - `/api/samples/[id]` - Deleting audio samples
- Switched from `adminRateLimit` to `uploadRateLimit` for user operations
- Middleware now only protects actual admin routes (`/admin/*`)

**Code Quality & Performance:**
- Removed verbose debug logging from audio engine, main page, and API routes
- Kept important error logging for debugging
- Cleaner console output for professional development experience
- Improved audio playback without verbose logging overhead

**Database Migrations:**
- Added position field to Zone model
- Updated unique constraints for soundboard-zone relationships
- Migrated existing data to new schema structure

**UI Polish:**
- Updated all backgrounds to bg-gray-950 for consistency
- Improved authentication page layouts
- Added proper loading and error states
- Enhanced responsive design

### Next Development Priorities

**High Priority - User Experience:**
1. **Enhanced Discovery:**
   - Search and filter functionality on Explore page
   - Trending/popular soundboard sections
   - User profile pages (`/user/[username]`)

2. **Soundboard Features:**
   - Soundboard templates for quick setup
   - Duplication/forking functionality
   - View counts and usage analytics
   - Custom URLs/slugs for sharing

3. **Social Features:**
   - Favorites/likes system
   - Following creators
   - Comments on soundboards

**Medium Priority - Polish:**
1. **Performance:**
   - Caching strategy implementation
   - CDN integration for audio files
   - Database query optimization

2. **PWA Features:**
   - Offline functionality
   - Mobile app-like experience
   - Push notifications

**Low Priority - Advanced:**
1. **Monetization:**
   - Premium features
   - Creator monetization tools
   - Marketplace functionality

2. **Admin Features:**
   - Content moderation tools
   - Usage analytics dashboard
   - Automated backup systems

### Known Issues & Production Notes

**Google OAuth Configuration:**
- Production domain requires both `https://bapbapbapbapbap.com` and `https://www.bapbapbapbapbap.com` in Google Cloud Console
- Redirect URIs must include both www and non-www versions for proper authentication
- Environment variable `NEXTAUTH_URL` should match the primary domain

**Development Environment:**
- Clean console output with only essential error logging
- Mobile UI tested and optimized for responsiveness
- All TypeScript compilation errors resolved
- Build process verified for production deployment

**Current Production Status:**
- Multi-user platform fully functional with universal navigation
- **✅ MOBILE PERFORMANCE OPTIMIZED** - Smooth animations on all mobile devices
- **Canvas rendering optimized** - No more GPU overdraw or sizing mismatches
- **Animation system performance-scaled** - Desktop complexity, mobile efficiency
- Authentication working (both Google OAuth and credentials)
- Audio upload system working correctly - all 405 errors resolved
- Mobile responsive design with optimized PIXI.js settings
- All critical features tested and operational
- Soundboard editing (upload, delete, modify) working for authenticated users

### Development Patterns

**File Structure:**
- API routes follow RESTful patterns in `src/app/api/`
- Page components in `src/app/` with route groups
- Reusable components in `src/components/`
- Business logic in `src/lib/` with domain-specific subdirectories

**Authentication Flow:**
- NextAuth.js handles all authentication
- Middleware protects private routes
- Session context available throughout app

**Data Flow:**
- Client interactions → API routes → Prisma → database updates
- Real-time updates via optimistic UI patterns
- File uploads → Vercel Blob → database URL storage

**TypeScript Standards:**
- Strict typing with explicit types for all variables
- Proper interface definitions for API responses
- Type-safe database operations with Prisma

### Key Dependencies
- Next.js 15.5.0 with App Router and Turbopack
- PIXI.js 8.12+ for graphics rendering
- Prisma 6.14+ with PostgreSQL
- NextAuth.js 4.x for authentication
- Tailwind CSS for styling
- Vercel Blob for file storage
- bcryptjs for password hashing

### Deployment Notes
- Vercel deployment configured
- Environment variables properly set
- Database migrations automated
- TypeScript compilation verified
- Production build optimized and tested
- **Latest deployment (2025-08-26):** 🚀 CRITICAL mobile performance optimization - canvas sizing fix, PIXI.js mobile optimization, animation performance scaling