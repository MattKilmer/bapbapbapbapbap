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
- `npx prisma db seed` - Seed database with initial data
- `npx prisma studio` - Open Prisma Studio for database management

### Environment Setup
- Copy `.env.example` to `.env.local` and configure:
  - `DATABASE_URL` - PostgreSQL connection string
  - `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
  - `ADMIN_PASSWORD` - Admin panel authentication

## Architecture Overview

This is an interactive audio-visual trigger application built with Next.js 15, featuring a 4×4 grid where each zone triggers particle animations and audio samples.

### Core System Architecture

**Frontend Architecture:**
- Next.js 15 with App Router and React 19
- PIXI.js for high-performance 2D particle rendering via `CanvasStage` component
- Audio engine using Tone.js and HTML5 Audio API
- Tailwind CSS with path alias `@/*` pointing to `./src/*`

**Backend Architecture:**
- Next.js API routes with comprehensive rate limiting system
- PostgreSQL database with Prisma ORM
- Vercel Blob storage for audio file uploads
- Cookie-based admin authentication via middleware

### Key Components

**Animation System (`src/lib/animations/`):**
- 16 unique particle-based animations (burst, ripple, confetti, waves, etc.)
- Standardized `Anim` interface with `key`, `name`, `schema`, and `run` function
- Animation context (`AnimCtx`) provides PIXI app, stage, zone info, and config
- Each animation is a separate module imported into the main index

**Database Schema:**
- `Zone` - 4×4 grid zones (id 1-16) with animation assignments and configs
- `Sample` - Audio samples linked to zones via foreign key relationship
- `Settings` - Global application settings like scale factor
- `Preset` - Saved configuration states

**Rate Limiting (`src/lib/rate-limit.ts`):**
- In-memory rate limiting with automatic cleanup
- Predefined limiters: `uploadRateLimit` (10/min), `adminRateLimit` (50/min), `generalRateLimit` (100/min)
- IP-based tracking with custom headers support

**Admin System:**
- Protected routes via middleware checking `adm` cookie against `ADMIN_PASSWORD`
- Upload interface for audio samples with drag-and-drop
- Zone configuration editor with animation and parameter controls
- Token-based upload system for secure file operations

### Development Patterns

**File Structure:**
- API routes follow RESTful patterns in `src/app/api/`
- Components organized by feature (Admin/, core components at root level)
- Library code in `src/lib/` with domain-specific subdirectories

**Data Flow:**
- Client triggers → PIXI animations + audio playback
- Admin changes → API routes → Prisma → database updates
- File uploads → Vercel Blob → database URL storage

**Authentication:**
- Simple cookie-based auth for admin panel
- Middleware protection on `/admin/*` and sensitive API routes
- No user registration - single admin access model

### Key Dependencies
- PIXI.js 8.12+ for graphics rendering
- Prisma 6.14+ with PostgreSQL
- Tone.js 15+ for audio synthesis
- Zustand for client state management
- Vercel Blob for file storage
- Zod for runtime type validation