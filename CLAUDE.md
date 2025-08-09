# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based Python learning platform called "Python Learning Hub" that provides interactive education through visualized programming concepts. The platform features multiple learning chapters covering Python fundamentals including programming basics, variables, data types, operations, lists, dictionaries, and loops.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm start` - Start production server  
- `npm run lint` - Run ESLint for code quality checks

### Database Commands
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio for database management

## Architecture Overview

### Core Technologies
- **Next.js 15** with App Router and TypeScript
- **React 19** with client-side state management
- **Prisma** with PostgreSQL for database and ORM
- **JWT** authentication with bcrypt password hashing
- **Tailwind CSS** for styling with shadcn/ui components
- **Monaco Editor** for interactive code editing
- **Framer Motion** for animations and transitions

### Key Architecture Patterns

**Chapter-based Learning Structure**: Each chapter (0-5) has its own directory with lessons, challenges, and components. Chapters are organized as:
- `/src/app/chapter[N]/` - Next.js routes for each chapter
- `/src/components/chapter[N]/` - Chapter-specific React components
- Lesson components follow naming pattern `Lesson[N][Topic].tsx`

**Authentication System**: Full-stack JWT authentication with database persistence:
- `AuthProvider` in `/src/components/auth/` manages user state with real API integration
- JWT tokens stored in localStorage with server-side session validation
- Username/password login with bcrypt hashing
- Authentication API routes: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`
- Authentication components: `LoginForm`, `RegisterForm`, `LogoutButton`
- Middleware protection for authenticated routes (`/dashboard`, `/chapter/*`, `/admin`)

**Dashboard Layout**: Modular dashboard structure:
- `DashboardLayout` orchestrates `NavigationBar`, `HeroSection`, `ChapterGrid`, `ProgressSidebar`
- Responsive design with mobile navigation support
- Progress tracking through dedicated progress components with database persistence

**Interactive Learning Components**: 
- `CodeEditor` wraps Monaco Editor with syntax highlighting
- `ListVisualizer` provides animated visualization of Python list operations
- `PythonListParser` in `/src/lib/pythonParser.ts` parses and executes Python code
- Challenge system with `ChallengeContainer`, `ChallengeResults`, `ChallengeSelection`
- Progress tracking API at `/api/progress` and `/api/challenges` with automatic progress updates

### Component Organization

Components are organized by feature and chapter:
```
src/components/
├── ui/              # shadcn/ui base components
├── auth/            # Authentication components
├── dashboard/       # Dashboard layout components  
├── chapter[N]/      # Chapter-specific learning components
├── interactive/     # Interactive learning widgets
├── lists/           # List-related learning components
├── progress/        # Progress tracking components
└── branding/        # Theme and branding components
```

### State Management

- **Authentication**: React Context (`AuthProvider`) with JWT token management
- **Progress Tracking**: Database-backed progress with API integration (`/api/progress`, `/api/challenges`)
- **Learning State**: Component-level state with props drilling for lesson data
- **Theme**: `WizardThemeProvider` for consistent magical branding
- **Admin Features**: Role-based access control with admin dashboard at `/admin`

### Data Layer

- **Database**: PostgreSQL with Prisma ORM (`/prisma/schema.prisma`)
- **Models**: Users, Chapters, Lessons, Challenges, UserProgress, LessonProgress, ChallengeAttempts, UserSessions
- **API Routes**: RESTful APIs in `/src/app/api/` for auth, progress, challenges, admin
- Static content in `/src/content/chapter1/` with lesson data  
- Dashboard data centralized in `/src/data/dashboardData.ts`
- TypeScript interfaces in `/src/types/` for type safety
- Database utilities in `/src/lib/prisma.ts` and `/src/lib/auth.ts`

## Development Guidelines

### Adding New Chapters
1. Create route: `/src/app/chapter[N]/page.tsx`
2. Add components: `/src/components/chapter[N]/`
3. Follow existing lesson naming: `Lesson[N][Topic].tsx`
4. Update dashboard data in `/src/data/dashboardData.ts`

### Interactive Components
- Use Monaco Editor for code input
- Implement Python parsing in `/src/lib/pythonParser.ts` for new operations
- Add animations with Framer Motion for visual feedback
- Follow existing challenge structure for assessments

### Database Setup
1. Ensure PostgreSQL is running and DATABASE_URL is configured in `.env`
2. Run `npm run db:generate` to generate Prisma client
3. Run `npm run db:migrate` to create database tables
4. Run `npm run db:seed` to populate with initial data (creates admin and sample user)

### Authentication System
- Username/password authentication (not email-based login)
- JWT tokens with 7-day expiration stored in localStorage
- Middleware protection for `/dashboard`, `/chapter/*`, and `/admin` routes
- Role-based access: USER and ADMIN roles with admin dashboard access

### Styling Standards
- Use Tailwind CSS classes with shadcn/ui components
- Follow existing magical/wizard theme with purple/blue gradients
- Maintain responsive design patterns from existing components
- Use Lucide React icons consistently

## File Structure Notes

- App routing follows Next.js 13+ App Router patterns
- Components use "use client" directive for client-side functionality
- TypeScript strict mode enabled with comprehensive type definitions
- CSS modules used sparingly (mainly in chapter3 components)

### Progress Tracking Integration
- Update progress via `/api/progress` POST endpoint with `chapterId`, `lessonId`, `timeSpent`, and `status`
- Record challenge attempts via `/api/challenges` POST endpoint
- Automatic calculation of completion rates and points
- Real-time progress updates in dashboard and admin panel

### Admin Features
- Admin dashboard at `/admin` with user management and analytics
- View user statistics, progress distribution, and top performers
- Manage user accounts (activate/deactivate, change roles)
- Monitor platform usage and challenge completion rates

## Testing Approach

Currently no test framework is configured. When adding tests, consider the interactive nature of the learning platform and the need to test:
- Python code parsing logic
- Animation sequences  
- User progress tracking and API integration
- Authentication flows and JWT handling
- Database operations and progress calculations
- Admin dashboard functionality