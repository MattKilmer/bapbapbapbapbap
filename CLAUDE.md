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
- **Profile Picture Upload System (2025-08-30)** - Complete custom profile picture functionality with Vercel Blob integration
- **Enhanced Admin Navigation (2025-08-30)** - Added main site navigation to admin dashboard for seamless user experience
- **Vercel Analytics Integration (2025-08-30)** - Added comprehensive user tracking for Reddit marketing campaign measurement
- **Previous Session Updates:**
  - **Role-Based Admin System (2025-08-29)** - Complete overhaul of admin authentication using NextAuth instead of cookies
  - **User Profile System Complete (2025-08-29)** - Full user profiles with username system, profile editing, and public/private soundboard display
  - **Profile Editing System (2025-08-29)** - Comprehensive settings page for username and display name editing with validation
  - **Navigation Enhancement (2025-08-29)** - User names in navigation link to profiles, Admin link for admin users
- **Previous Major Updates:**
  - **Admin Dashboard MVP (2025-08-29)** - Professional admin panel with sidebar navigation, user management, soundboard moderation
  - **Dynamic Open Graph Sharing (2025-08-29)** - Social media previews show "[Soundboard] by [Creator] - Play it now on BapBapBapBapBap"
  - **Default Soundboard Configuration (2025-08-29)** - Set 'luvs' soundboard as main site default while preserving welcome experience
- **Previous Updates:**
  - **🚀 CRITICAL MOBILE PERFORMANCE OPTIMIZATION (2025-08-26)** - Comprehensive fix for slow mobile animations
  - **Canvas Sizing Bug Fix** - Resolved critical canvas oversizing issue (viewport vs container mismatch)
  - **Mobile-Optimized PIXI.js** - Disabled antialias, low-power mode, proper mobile detection
  - **Animation Performance Scaling** - Reduced particle counts 6x on mobile, simplified calculations
  - **GPU Overdraw Elimination** - Canvas now exactly matches container dimensions
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
  id, email, name, username, password, role
  image, customImage
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
- `/` - Default landing/main soundboard experience (uses 'luvs' soundboard)
- `/auth/signin` & `/auth/signup` - Authentication pages
- `/dashboard` - Personal soundboard management
- `/explore` - Public soundboard discovery
- `/play/[id]` - Specific soundboard playback (with dynamic Open Graph)
- `/soundboard/new` - Create new soundboard
- `/soundboard/[id]/edit` - Edit soundboard (owner only)
- `/user/[username]` - Public user profiles with soundboard collections
- `/settings` - Profile editing (username, display name, account info)
- `/access-denied` - Friendly error page for non-admin users attempting admin access
- `/admin` - Admin panel (redirects to dashboard)
- `/admin/dashboard` - Admin overview with metrics
- `/admin/users` - User management and role editing
- `/admin/soundboards` - Soundboard moderation
- `/admin/builder` - Zone editor (original admin functionality)

### Key Features Implemented

**User Management:**
- Google OAuth integration with fallback to email/password
- Protected routes and session management
- User dashboard with soundboard list
- Delete soundboard functionality with confirmation
- **Public user profiles** at `/user/[username]` with soundboard collections
- **Profile editing system** with username and display name management
- **Custom profile picture uploads** with Vercel Blob integration and OAuth fallbacks
- **Username validation** with uniqueness checks and reserved word protection
- **Session synchronization** when profile updates occur

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
- Admin API endpoints under `/api/admin/` (stats, users, soundboards)
- Dynamic metadata generation for social sharing
- **User profile endpoints** `/api/user/[username]` and `/api/user/profile`
- **Username generation endpoint** `/api/admin/generate-usernames` for existing users

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
- **Smart profile linking** - User names link to profiles when username exists, settings when not
- **Role-based admin access** - Red "Admin" link appears for users with ADMIN role

**Copy Functionality (`src/components/CopyLinkButton.tsx`):**
- Reusable clipboard integration
- Browser compatibility with fallbacks
- Visual feedback for successful copies

### User Profile System

**Profile Features:**
- **Public User Profiles** (`/user/[username]`) - Display user info, soundboard collections, stats
- **Profile Editing** (`/settings`) - Comprehensive settings page for profile management
- **Username System** - Unique usernames with validation (3-20 chars, alphanumeric + underscore)
- **Display Names** - Customizable display names up to 50 characters
- **Custom Profile Pictures** - Upload custom images with 5MB limit, file validation, and Vercel Blob storage
- **Profile Image Prioritization** - Custom images take priority over OAuth images with graceful fallbacks
- **Image Management** - Remove custom images to revert to OAuth profile pictures
- **Edit Profile Button** - Appears on own profile for quick access to settings
- **Username Generation** - Admin tool and script for generating usernames for existing users

**Profile API Endpoints:**
- `/api/user/[username]` - Get public profile data by username
- `/api/user/profile` - Get/update current user's profile
- `/api/admin/generate-usernames` - Bulk username generation for existing users

**Username Validation Rules:**
- 3-20 characters in length
- Only letters, numbers, and underscores
- Cannot start or end with underscore
- Must be unique across platform
- Reserved words blocked (admin, api, dashboard, etc.)

### Admin System

**Admin Panel Structure:**
- **AdminLayout** (`src/components/Admin/AdminLayout.tsx`) - Layout wrapper with sidebar and main site navigation
- **AdminSidebar** (`src/components/Admin/AdminSidebar.tsx`) - Collapsible navigation sidebar
- **Main Site Navigation** - Full navigation bar for seamless switching between admin and user functions
- `/admin/dashboard` - Overview with key metrics and quick stats
- `/admin/users` - User management with role editing and search/filter
- `/admin/soundboards` - Soundboard moderation and visibility management
- `/admin/builder` - Zone editor (moved from original `/admin`)

**Admin Authentication:**
- **Role-based authentication** using NextAuth session system
- Protected via middleware for both admin pages (`/admin/*`) and API routes (`/api/admin/*`)
- **Integrated with user system** - ADMIN role users get access
- **Single sign-on** - same authentication as regular users

**Admin API Endpoints:**
- `/api/admin/stats` - Dashboard statistics (users, soundboards, plays, growth)
- `/api/admin/users` - User management with statistics
- `/api/admin/users/[id]` - User role updates and deletion
- `/api/admin/soundboards` - All soundboards with moderation data

**Admin Dashboard Features:**
- **Key Metrics**: Total users, soundboards, plays, active sessions
- **User Growth**: Month-over-month percentage tracking
- **Popular Soundboards**: Top 5 by play count with creator info
- **Recent Users**: Latest 5 signups with dates
- **Quick Actions**: Direct links to management pages

**User Management Features:**
- **User Table**: Name, email, role, soundboard count, total plays, last active
- **Role Management**: Inline dropdown to change USER/ARTIST/ADMIN roles
- **Search & Filter**: By name/email and role type
- **Sorting**: By date, name, soundboards, or plays
- **Delete Users**: With confirmation dialogs

**Soundboard Management Features:**
- **All Soundboards View**: Name, creator, status, zone stats, plays
- **Visibility Toggle**: One-click public/private switching
- **Creator Information**: Full user details with avatar
- **Zone Statistics**: Active vs total zones per soundboard
- **Direct Actions**: View, edit, delete with proper permissions

### Role System Status

**Current Implementation:**
- **USER**: Default role assigned to new signups, standard permissions
- **ARTIST**: Exists in database but no special functionality implemented (placeholder)
- **ADMIN**: Full admin panel access + can edit/delete any soundboard

**Role System Features:**
- **Integrated Authentication**: Admin panel uses NextAuth session system (no separate login)
- **Middleware Protection**: Admin routes protected by JWT token validation
- **Navigation Integration**: Admin link appears in navigation for ADMIN users
- **Access Control**: Non-admin users redirected to access denied page
- **Database Management**: Role changes via database updates or admin panel

**What Each Role Currently Does:**
- **USER**: Can only edit/delete their own soundboards, standard user interface
- **ARTIST**: Same as USER (no special features yet - placeholder for future premium features)
- **ADMIN**: Full admin panel access + can edit/delete ANY soundboard + admin navigation link

**Admin Panel Access:**
- **mvkilmer@gmail.com**: Set as super admin with full privileges
- **Role-based routing**: `/admin/*` paths require ADMIN role
- **Session validation**: All admin pages verify authentication and authorization
- **Single sign-on**: Same login flow as regular users

### Sharing & Social Features

**Dynamic Open Graph Implementation:**
- **Server-side metadata generation** for `/play/[id]` pages
- **Dynamic titles**: "[Soundboard Name] by [Creator Name] - BapBapBapBapBap"
- **Smart descriptions**: Uses soundboard description or fallback with call-to-action
- **Social media optimization**: Proper Open Graph and Twitter Card tags
- **Fallback handling**: Graceful degradation for missing data

**Default Soundboard Configuration:**
- **Main site** (`/`) now uses 'luvs' soundboard (ID: cmewa8cfm0001le04cotogugb) as default
- **Welcome screen preserved**: Original welcome message and logo remain intact
- **Smart fallback**: If 'luvs' soundboard is not found, falls back to any public soundboard
- **API configuration**: Updated `/api/config` endpoint to use specific soundboard by ID

### Analytics & Marketing Tools

**Vercel Analytics Integration:**
- **@vercel/analytics/next** integrated in root layout for comprehensive user tracking
- **Page view tracking** with automatic source attribution (including reddit.com referrals)
- **User behavior analytics** for measuring engagement and conversion rates
- **Traffic source analysis** to optimize marketing campaigns and measure Reddit post effectiveness
- **Real-time metrics** available in Vercel dashboard for immediate campaign feedback

**Marketing Campaign Support:**
- **Reddit Community Strategy** - Tailored content for music production communities
- **Traffic Attribution** - Track which Reddit posts drive the most valuable users
- **Conversion Funnels** - Monitor user journey from Reddit to registration/soundboard creation
- **A/B Testing Ready** - Analytics foundation supports testing different approaches

### Recent Fixes & Improvements

**Latest Session (2025-08-30):**
- **Profile Picture Upload System** - Complete custom image upload with Vercel Blob storage
- **Next.js Image Configuration** - Fixed Vercel Blob domain support for custom profile pictures
- **Admin Navigation Enhancement** - Added main site navigation to admin panel for seamless UX
- **TypeScript Compilation** - Resolved all build errors for production deployment
- **Vercel Analytics** - Added comprehensive user tracking for marketing measurement

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

**High Priority - Core System:**
1. **Role System Integration:**
   - Connect user roles to admin panel access (replace cookie auth)
   - Implement ARTIST features (verified badges, enhanced analytics)
   - Add role-based UI elements and navigation
   - Create role promotion workflow for admins

2. **Admin Panel Enhancement:**
   - Add analytics dashboard with charts and trends
   - Implement content moderation tools
   - Add audit logging for admin actions
   - Create bulk operations for soundboard management

3. **Enhanced Discovery:**
   - Search and filter functionality on Explore page
   - Trending/popular soundboard sections
   - User profile pages (`/user/[username]`)

**Medium Priority - User Experience:**
1. **Soundboard Features:**
   - Soundboard templates for quick setup
   - Duplication/forking functionality
   - Custom URLs/slugs for sharing
   - Enhanced analytics for creators

2. **Social Features:**
   - Favorites/likes system
   - Following creators
   - Comments on soundboards
   - Creator verification system

**Low Priority - Advanced:**
1. **Performance & Technical:**
   - Caching strategy implementation
   - CDN integration for audio files
   - Database query optimization
   - PWA features (offline, push notifications)

2. **Monetization & Business:**
   - Premium features for ARTIST accounts
   - Creator monetization tools
   - Marketplace functionality
   - Advanced analytics and insights

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

### Configuration
- **Next.js Image Optimization** - Configured for Google and GitHub profile images
- **Remote Image Patterns** - `lh3.googleusercontent.com` and `avatars.githubusercontent.com`
- **Database Schema** - Username field with unique constraint added to User model
- **Session Management** - NextAuth updated to include username in JWT and session
- **Admin Authentication** - Middleware uses JWT token validation instead of cookies

### Scripts & Tools
- **Username Generation** - `scripts/generate-usernames.js` for bulk username creation
- **Admin Role Setup** - `scripts/set-admin-role.js` to assign ADMIN role to users
- **Database Management** - All scripts include proper error handling and success reporting

### Deployment Notes
- Vercel deployment configured
- Environment variables properly set
- Database migrations automated
- TypeScript compilation verified
- Production build optimized and tested
- **Latest deployment (2025-08-29):** Role-based admin authentication system, complete user profiles with editing, and integrated navigation