# Monorepo Boilerplate 2026

A production-ready, enterprise-grade TypeScript monorepo boilerplate featuring a Fastify backend, Next.js web application, React admin panel, and Expo mobile app. Built with modern tools and best practices, this boilerplate provides a solid foundation for building scalable full-stack applications.

## 📑 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Architecture](#-architecture)
- [Installation](#️-installation)
- [Project Setup](#-project-setup)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Database](#️-database)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [AI Development Guidelines](#-ai-development-guidelines)

## 🚀 Features

### Backend Server (Fastify)
- **Framework**: Fastify - High-performance, low-overhead web framework
- **Language**: TypeScript with strict type checking
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Validation**: Zod schemas for request/response validation
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **File Storage**: AWS S3 integration for file uploads
- **Email**: Brevo email service integration with templating
- **Security**: 
  - Helmet.js for security headers
  - CORS configuration
  - Rate limiting to prevent abuse
  - Input sanitization and validation
- **Logging**: Structured logging with Pino
- **Error Handling**: Centralized error handling with custom HttpError class
- **Containerization**: Docker setup for PostgreSQL database

### Web Application (Next.js)
- **Framework**: Next.js 15 with App Router
- **UI Library**: Material-UI (MUI) with custom theming
- **Styling**: Tailwind CSS + SCSS modules
- **State Management**: 
  - TanStack Query (React Query) for server state
  - Context API for global state
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe integration
- **Real-time**: Socket.io client for WebSocket connections
- **Theming**: Dark/light mode support with next-themes
- **Date Handling**: date-fns and moment.js

### Admin Panel (Vite + React)
- **Framework**: React with Vite for fast development
- **UI Library**: Material-UI with custom theme provider
- **Data Grid**: MUI X Data Grid for complex tables
- **Routing**: React Router v6
- **Charts**: Recharts for data visualization
- **State Management**: TanStack Query + Context
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS + SCSS
- **Icons**: Lucide React icons

### Mobile App (Expo React Native)
- **Framework**: Expo SDK 54 with React Native
- **Navigation**: Expo Router with file-based routing
- **Maps**: React Native Maps with custom markers
- **UI Components**: Custom components with native feel
- **State Management**:
  - Zustand for client state
  - TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Storage**: MMKV for fast local storage
- **Authentication**: Google Sign-In, Apple Authentication
- **Animations**: Reanimated for smooth animations
- **Bottom Sheets**: Gorhom Bottom Sheet
- **Charts**: Victory Native for data visualization
- **Platform Support**: iOS, Android, and Web

### Shared Packages
- **@shared/ui**: Shared React UI components
- **@shared/schemas**: Shared Zod validation schemas (coming soon)
- **@repo/config**: Shared configurations
  - Tailwind config
  - TypeScript configs (base, Next.js, Node)

## 📋 Prerequisites

### Required
- **Node.js**: Version 20 or higher ([Download](https://nodejs.org/))
- **npm**: Version 9+ (comes with Node.js)
- **Docker**: For PostgreSQL database ([Download](https://www.docker.com/))
- **Git**: For version control

### Optional (for mobile development)
- **Xcode**: For iOS development (macOS only)
- **Android Studio**: For Android development
- **Expo Go App**: For quick testing on physical devices

### Platform-Specific
- **macOS**: Required for iOS development
- **Windows/Linux**: Can develop for Android and Web

## 🏗️ Architecture

### Monorepo Structure

This project uses **npm workspaces** to manage a monorepo with multiple packages:

```
monorepo-root/
├── app/                    # Application packages
│   ├── server/             # Backend API
│   ├── web/                # Next.js web app
│   ├── admin/              # Admin panel
│   └── mobile-app/         # Mobile app
└── shared/                 # Shared packages
    ├── ui/                 # Shared components
    ├── schemas/            # Shared validators
    └── config/             # Shared configs
```

### Backend Architecture

The backend follows a **modular route-based architecture**:

```
server/
├── routes/
│   ├── authRoutes/         # Authentication endpoints
│   │   ├── authRoutes.ts   # Route definitions + schemas
│   │   └── controllers/    # Business logic
│   │       ├── login.ts
│   │       └── signup.ts
│   ├── userRoutes/         # User management
│   └── healthRoutes/       # Health check
├── middleware/             # Auth, validation, etc.
├── plugins/                # Fastify plugins (CORS, Swagger)
├── schemas/                # Zod validation schemas
├── helpers/                # Auth, AWS, email utilities
├── db/                     # Prisma client
└── utils/                  # Error handling, logging
```

**Key Principles**:
- One controller per endpoint
- Zod schemas for validation and type inference
- Prisma for database access
- Centralized error handling
- JWT authentication middleware

### Frontend Architecture

Both web and admin apps follow a **component-based architecture**:

```
app/(web|admin)/src/
├── app/                    # Pages (file-based routing)
├── components/             # Reusable UI components
├── common/                 # Common wrappers (auth, query provider)
├── layouts/                # Layout components
├── helpers/                # API calls, utilities
├── theme/                  # Theming configuration
└── styles/                 # Global styles
```

### Mobile Architecture

```
mobile-app/src/
├── app/                    # Expo Router pages
│   ├── (home)/             # Tab navigation group
│   ├── login.tsx
│   └── _layout.tsx
├── components/             # Feature components
├── context/                # React Context providers
├── hooks/                  # Custom hooks
├── services/               # API services
├── assets/                 # Images, fonts, icons
└── constants/              # Theme, API keys
```

### Data Flow

1. **Request Flow**: Client → API → Middleware → Controller → Prisma → Database
2. **Response Flow**: Database → Prisma → Controller → Zod validation → Client
3. **State Management**: 
   - Server state via TanStack Query
   - Client state via Context/Zustand
   - Local storage via localStorage/MMKV

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mono-repo-boilerplate
```

### 2. Install Dependencies

Install all workspace dependencies from the root:

```bash
npm install
```

This will install dependencies for:
- Root workspace
- All apps (server, web, admin, mobile-app)
- All shared packages (ui, schemas, config)

### 3. Environment Setup

#### Backend Server Environment

Create environment file for the server:

```bash
cd app/server
cp .env.example .env
```

Edit `app/server/.env` with your configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mydb
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# AWS S3 (optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain

# Brevo Email (optional)
BREVO_API_KEY=your-api-key
BREVO_API_URL=https://api.brevo.com/v3
BREVO_FROM_EMAIL=noreply@example.com
BREVO_FROM_NAME=Your App
```

#### Mobile App Environment

Create environment files for mobile app:

```bash
cd app/mobile-app
cp .env.example .env
cp .env.example .env.dev
```

Edit with your API endpoints and keys.

### 4. Database Setup

Start PostgreSQL using Docker:

```bash
# From root directory
npm run db:up
```

Run database migrations:

```bash
npm run db:migrate
```

Generate Prisma Client:

```bash
npm run db:generate
```

### 5. Start Development Servers

```bash
# From root directory

# Start all apps (server, web, admin)
npm run dev

# Or start individual apps
npm run dev:server   # Backend at http://localhost:3000
npm run dev:web      # Web app at http://localhost:3001
npm run dev:admin    # Admin at http://localhost:5173
npm run dev:mobile   # Mobile app (Expo dev server)
```

## 📱 Project Setup

### Backend Server Setup

#### First-Time Setup

1. **Install dependencies**:
```bash
cd app/server
npm install
```

2. **Configure environment**: Edit `.env` file (see Environment Setup above)

3. **Start database**:
```bash
npm run db:up
```

4. **Run migrations**:
```bash
npm run db:migrate
```

5. **Generate Prisma Client**:
```bash
npm run db:generate
```

6. **Start server**:
```bash
npm run dev
```

Server runs at: `http://localhost:3000`

API docs at: `http://localhost:3000/api-docs`

#### Development Workflow

```bash
# Watch mode with auto-reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint:fix

# Database GUI
npm run db:studio
```

### Web App Setup

#### First-Time Setup

1. **Install dependencies** (if not done from root):
```bash
cd app/web
npm install
```

2. **Configure API endpoint** (optional if using .env.local):
   - Add `.env.local` with `NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000`
   - Or edit `src/helpers/constants.ts` to set `CONSTANTS.API_ENDPOINT`

3. **Start development server**:
```bash
npm run dev
```

Web app runs at: `http://localhost:3001`

#### Development Workflow

```bash
# Development with Turbopack (faster)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint:fix

# Production build
npm run build
npm run start
```

#### Environment Variables (Optional)

Create `.env.local` for web app:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_KEY=your-stripe-key
```

### Admin Panel Setup

#### First-Time Setup

1. **Install dependencies**:
```bash
cd app/admin
npm install
```

2. **Configure API endpoint**:
   - Add `.env` with `VITE_API_ENDPOINT=http://localhost:3000`
   - Or edit `src/helpers/constants.ts` to set `CONSTANTS.API_ENDPOINT`

3. **Start development server**:
```bash
npm run dev
```

Admin panel runs at: `http://localhost:5173`

#### Development Workflow

```bash
# Development with HMR
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint:fix

# Production build
npm run build
npm run preview
```

### Mobile App Setup

#### First-Time Setup

1. **Install dependencies**:
```bash
cd app/mobile-app
npm install
```

2. **Configure environment**:
Edit `.env` and `.env.dev` files:
```env
API_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your-api-key
```

3. **Configure Google Services** (for maps):
   - iOS: Add your `ParkNest Google Service Info.plist`
   - Android: Add your `ParkNest Google Services.json`

4. **Start Expo dev server**:
```bash
npm run dev
```

#### Running on Platforms

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web

# QR code for Expo Go
npm run start
```

#### Building for Production

```bash
# Prebuild native code
npm run prebuild

# Build with EAS
eas build --platform ios
eas build --platform android
```

#### Platform-Specific Setup

**iOS Development**:
1. Install Xcode from App Store
2. Install iOS Simulator
3. Accept Xcode license: `sudo xcodebuild -license`

**Android Development**:
1. Install Android Studio
2. Install Android SDK
3. Create virtual device (AVD)
4. Add Android SDK to PATH

**Testing on Physical Device**:
1. Download Expo Go from App Store/Play Store
2. Run `npm run start`
3. Scan QR code with phone

### Shared Packages

Shared packages are automatically linked via npm workspaces.

#### Using Shared Packages

**In any app**:

```typescript
// Import from shared UI
import { SharedCard } from '@shared/ui';

// Import from shared schemas (when implemented)
import { userSchema } from '@shared/schemas';

// TypeScript configs are automatically used via extends
```

#### Developing Shared Packages

```bash
# UI Components
cd shared/ui
# Edit src/components/*

# Schemas
cd shared/schemas
# Edit src/*

# Config
cd shared/config
# Edit configs in respective folders
```

Changes to shared packages are instantly reflected in all apps (no rebuild needed).

## 📜 Available Scripts

### Development

#### All Apps
- `npm run dev` - Start all development servers (server, web, admin)
- `npm run build` - Build all projects

#### Individual Apps
- `npm run dev:server` - Start backend server only
- `npm run dev:web` - Start web app only
- `npm run dev:admin` - Start admin panel only
- `npm run dev:mobile` - Start mobile app development server

#### Mobile App Specific
- `npm run mobile:start` - Start Expo development server
- `npm run mobile:android` - Run on Android device/emulator
- `npm run mobile:ios` - Run on iOS simulator/device
- `npm run mobile:web` - Run mobile app in web browser

### Building

- `npm run build:server` - Build backend server
- `npm run build:web` - Build web app
- `npm run build:admin` - Build admin panel

### Linting

- `npm run lint:staged` - Lint all staged files
- `npm run lint:server` - Lint and fix server code
- `npm run lint:web` - Lint and fix web app code
- `npm run lint:admin` - Lint and fix admin panel code
- `npm run lint:mobile` - Lint and fix mobile app code

### Database

- `npm run db:up` - Start PostgreSQL container
- `npm run db:down` - Stop and remove PostgreSQL container
- `npm run db:stop` - Stop PostgreSQL container (keeps data)
- `npm run db:logs` - View PostgreSQL logs
- `npm run db:reset` - Reset database (removes all data)
- `npm run db:test` - Test database connection
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Database Migrations

- `npx prisma migrate dev --name <migration_name>` - Create and apply a new migration
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:migrate:reset` - Reset database and apply all migrations

## 🔧 Adding New Projects

You can easily add new projects to the monorepo using the interactive project generator:

```bash
npm run add-project
```

This will guide you through creating a new project with the following options:

### Supported Project Types

1. **Server** - Node.js Backend (Fastify + TypeScript)
2. **Web** - Next.js Web App (React + TypeScript + SSR)
3. **Web App** - Web App SPA (Vite + React + TypeScript)
4. **Admin** - Admin Panel (Vite + React + TypeScript)
5. **Mobile** - Mobile App (Expo + React Native + TypeScript)

### What It Does

The script will:
- ✅ Create project directory in `app/<project-name>`
- ✅ Generate `package.json` with appropriate dependencies
- ✅ Create `tsconfig.json` extending shared configs
- ✅ Set up ESLint configuration
- ✅ Create initial file structure
- ✅ Update root `package.json` with new scripts
- ✅ Add lint-staged configuration

### Example Usage

```bash
$ npm run add-project

Select project type:
  1. Node.js Backend (Fastify + TypeScript)
  2. Next.js Web App (React + TypeScript + SSR)
  3. Web App SPA (Vite + React + TypeScript)
  4. Admin Panel (Vite + React + TypeScript)
  5. Mobile App (Expo + React Native + TypeScript)

Enter project type (1-5): 1
Enter project name: my-api

✨ Project structure created successfully!
```

After creating a project:
```bash
npm install              # Install dependencies
npm run dev:my-api       # Start development server
```

## 📁 Project Structure

### Complete Directory Tree

```
monorepo-root/
├── app/                          # Application workspace
│   ├── server/                   # Fastify Backend Server
│   │   ├── db/                   # Database configuration
│   │   │   ├── connection.ts     # PostgreSQL connection
│   │   │   └── index.ts          # Prisma client export
│   │   ├── docker-compose.yml    # PostgreSQL container config
│   │   ├── helpers/              # Helper utilities
│   │   │   ├── auth/             # Authentication helpers
│   │   │   │   ├── bcrypt.ts     # Password hashing
│   │   │   │   ├── jwt.ts        # JWT token management
│   │   │   │   └── index.ts
│   │   │   ├── aws/              # AWS integrations
│   │   │   │   └── s3.ts         # S3 file upload
│   │   │   ├── email/            # Email service
│   │   │   │   ├── email.ts      # Brevo integration
│   │   │   │   └── templates/    # Email templates
│   │   │   └── index.ts
│   │   ├── middleware/           # Request middleware
│   │   │   └── isAuthenticated.ts # JWT auth middleware
│   │   ├── plugins/              # Fastify plugins
│   │   │   ├── cors.ts           # CORS configuration
│   │   │   ├── multipart.ts      # File upload handling
│   │   │   ├── rateLimit.ts      # Rate limiting
│   │   │   ├── security.ts       # Helmet security headers
│   │   │   ├── swagger.ts        # API documentation
│   │   │   └── index.ts
│   │   ├── prisma/               # Database schema
│   │   │   ├── migrations/       # Migration files
│   │   │   └── schema.prisma     # Prisma schema
│   │   ├── routes/               # API routes
│   │   │   ├── authRoutes/       # Authentication
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── login.ts
│   │   │   │   │   └── signup.ts
│   │   │   │   └── authRoutes.ts
│   │   │   ├── userRoutes/       # User management
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── createUser.ts
│   │   │   │   │   └── getUsers.ts
│   │   │   │   └── userRoutes.ts
│   │   │   ├── healthRoutes/     # Health check
│   │   │   └── index.ts          # Route aggregator
│   │   ├── schemas/              # Zod validation schemas
│   │   │   ├── authSchemas.ts
│   │   │   ├── userSchemas.ts
│   │   │   └── index.ts
│   │   ├── scripts/              # Utility scripts
│   │   │   └── test-db-connection.ts
│   │   ├── types/                # TypeScript types
│   │   │   └── routeContext.ts
│   │   ├── utils/                # Utility functions
│   │   │   ├── env.ts            # Environment validation
│   │   │   ├── errorHandler.ts   # Global error handler
│   │   │   ├── HttpError.ts      # Custom error class
│   │   │   ├── logger.ts         # Pino logger
│   │   │   └── swaggerSchemas.ts # Swagger helpers
│   │   ├── index.ts              # Server entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                      # Next.js Web Application
│   │   ├── src/
│   │   │   ├── app/              # App Router pages
│   │   │   │   ├── auth/         # Auth pages
│   │   │   │   ├── dashboard/    # Dashboard pages
│   │   │   │   ├── layout.tsx    # Root layout
│   │   │   │   └── page.tsx      # Home page
│   │   │   ├── common/           # Common wrappers
│   │   │   │   ├── authPageLayout/
│   │   │   │   ├── configWrapper/
│   │   │   │   ├── dashboardLayout/
│   │   │   │   ├── queryProvider/
│   │   │   │   └── userProvider/
│   │   │   ├── components/       # React components
│   │   │   ├── helpers/          # Utilities
│   │   │   │   ├── api.ts
│   │   │   │   ├── apiRequest.ts # API client
│   │   │   │   ├── assets.ts
│   │   │   │   └── constants.ts
│   │   │   ├── interfaces/       # TypeScript interfaces
│   │   │   ├── styles/           # SCSS styles
│   │   │   │   └── globals.scss
│   │   │   └── theme/            # Theme config
│   │   │       ├── ThemeProvider.tsx
│   │   │       └── colors.ts
│   │   ├── public/               # Static assets
│   │   │   ├── icons/
│   │   │   └── images/
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   │
│   ├── admin/                    # React Admin Panel (Vite)
│   │   ├── src/
│   │   │   ├── app/              # Page components
│   │   │   │   ├── admins/       # Admin management
│   │   │   │   ├── auth/login/   # Login page
│   │   │   │   ├── users/        # User management
│   │   │   │   └── page.tsx      # Dashboard
│   │   │   ├── common/           # Common wrappers
│   │   │   │   ├── authPageLayout/
│   │   │   │   ├── dashboardLayout/
│   │   │   │   ├── queryProvider/
│   │   │   │   ├── sidebar/
│   │   │   │   └── userProvider/
│   │   │   ├── components/       # Feature components
│   │   │   │   ├── admin/
│   │   │   │   ├── booking/
│   │   │   │   ├── common/       # Reusable components
│   │   │   │   ├── user/
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── layouts/          # Layout components
│   │   │   ├── helpers/          # Utilities
│   │   │   ├── interfaces/       # TypeScript types
│   │   │   ├── styles/
│   │   │   │   └── globals.scss
│   │   │   ├── theme/            # MUI theme
│   │   │   ├── App.tsx           # App root
│   │   │   └── main.tsx          # Entry point
│   │   ├── public/               # Static assets
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── mobile-app/               # Expo React Native Mobile App
│       ├── src/
│       │   ├── app/              # Expo Router pages
│       │   │   ├── (home)/       # Tab navigation group
│       │   │   │   ├── _layout.tsx
│       │   │   │   ├── index.tsx # Home screen
│       │   │   │   ├── items.tsx # Items screen
│       │   │   │   ├── chat.tsx  # Chat screen
│       │   │   │   └── settings.tsx
│       │   │   ├── _layout.tsx   # Root layout
│       │   │   ├── login.tsx
│       │   │   ├── register.tsx
│       │   │   ├── verifyOtp.tsx
│       │   │   └── onboarding.tsx
│       │   ├── components/       # Feature components
│       │   │   ├── Home/
│       │   │   ├── Items/
│       │   │   ├── Login/
│       │   │   ├── Register/
│       │   │   ├── chat/
│       │   │   └── common/       # Reusable components
│       │   ├── assets/           # Static assets
│       │   │   ├── fonts/
│       │   │   ├── icons/        # SVG icon components
│       │   │   └── images/
│       │   ├── constants/        # Configuration
│       │   │   ├── theme.ts
│       │   │   ├── fonts.ts
│       │   │   └── api_keys.ts
│       │   ├── context/          # React Context
│       │   ├── helpers/          # Utilities
│       │   ├── hooks/            # Custom hooks
│       │   ├── services/         # API services
│       │   └── interfaces/       # TypeScript types
│       ├── patches/              # npm package patches
│       ├── app.json              # Expo configuration
│       ├── package.json
│       └── tsconfig.json
│
├── shared/                       # Shared Packages
│   ├── config/                   # @repo/config
│   │   ├── package.json
│   │   ├── tailwind/             # Shared Tailwind config
│   │   │   └── index.cjs
│   │   └── ts/                   # TypeScript configs
│   │       ├── base.json         # Base config
│   │       ├── next.json         # Next.js config
│   │       └── node.json         # Node.js config
│   ├── ui/                       # @shared/ui
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── SharedCard.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── schemas/                  # @shared/schemas
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── .husky/                       # Git hooks
│   └── pre-commit                # Pre-commit linting
├── .gitignore
├── .npmrc                        # npm configuration
├── .prettierrc.json              # Prettier config
├── .prettierignore
├── eslint.config.mjs             # Root ESLint config
├── Makefile                      # Make commands
├── package.json                  # Root package.json (workspaces)
├── package-lock.json
├── tsconfig.json                 # Root TypeScript config
└── README.md                     # This file
```

### Architecture Patterns

#### Backend Route Architecture

Each feature module follows a consistent pattern:

```
routes/
  └── featureName/
      ├── featureRoutes.ts      # Route definitions + Zod schemas
      └── controllers/          # Business logic (one file per endpoint)
          ├── getFeature.ts
          ├── createFeature.ts
          ├── updateFeature.ts
          └── deleteFeature.ts
```

**Route File Structure**:
```typescript
// routes/featureName/featureRoutes.ts
export async function featureRoutes(fastify: FastifyInstance) {
  // Define routes with schemas for validation & Swagger
  fastify.get('/feature', { schema: {...} }, getController);
  fastify.post('/feature', { schema: {...} }, createController);
}
```

**Controller Structure**:
```typescript
// routes/featureName/controllers/getController.ts
export async function getController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 1. Extract/validate data
  // 2. Call Prisma for database operations
  // 3. Return response
}
```

#### Frontend Component Architecture

**Component Organization**:
- **Pages**: In `app/` directory (Next.js) or `src/app/` (Expo Router)
- **Components**: In `components/` organized by feature
- **Common**: Shared wrappers and utilities
- **Layouts**: Page layout components

**State Management**:
- **Server State**: TanStack Query (React Query)
- **Global State**: React Context API
- **Local State**: React useState/useReducer
- **Mobile State**: Zustand (mobile app only)

#### Database Layer

**Prisma Schema Location**: `app/server/prisma/schema.prisma`

**Access Pattern**:
```typescript
import { prisma } from '../../../db';

// All database operations go through Prisma
const user = await prisma.user.findUnique({ where: { id: 1 } });
```

**Migration Workflow**:
1. Modify `schema.prisma`
2. Run `npm run db:migrate` to create migration
3. Prisma Client auto-regenerates

#### Validation Layer

**Schema Location**: `app/server/schemas/`

**Usage Pattern**:
```typescript
// Define schema
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

// Infer type
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Use in route
fastify.post('/users', {
  schema: {
    body: createUserSchema,
  },
}, createUserController);
```

#### Error Handling

**Backend**:
```typescript
// Throw custom errors
throw new HttpError(400, 'Invalid input');

// Global error handler catches all errors
```

**Frontend**:
```typescript
// TanStack Query handles errors automatically
const { error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

#### Authentication Flow

1. User logs in → Backend validates credentials
2. Backend generates JWT token
3. Frontend stores token (localStorage/MMKV)
4. Frontend sends token in Authorization header
5. Backend middleware validates token
6. Request proceeds with `request.user` populated

## 🔧 Configuration

### Environment Variables

#### Backend Server (app/server/.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mydb
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Database URL (used by Prisma)
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# AWS S3 Configuration (Optional - for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net

# Brevo Email Service (Optional - for sending emails)
BREVO_API_KEY=your-brevo-api-key
BREVO_API_URL=https://api.brevo.com/v3
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=Your App Name
```

#### Web App (app/web/.env.local) - Optional

```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

#### Admin Panel (app/admin/.env) - Optional

```env
VITE_API_ENDPOINT=http://localhost:3000
```

#### Mobile App (app/mobile-app/.env)

```env
# API Configuration
API_URL=http://localhost:3000

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Other API Keys (if needed)
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Configuration Files

#### Workspace Configuration (Root package.json)

The root `package.json` defines workspaces:

```json
{
  "workspaces": [
    "app/*",
    "shared/*"
  ]
}
```

#### ESLint Configuration

- **Root**: `eslint.config.mjs` - Base config for all packages
- **Server**: `app/server/eslint.config.mjs` - Backend-specific rules
- **Web/Admin**: Extends from `@repo/config`
- **Mobile**: Uses Expo's ESLint config

#### TypeScript Configuration

- **Root**: `tsconfig.json` - Base config
- **Shared**: `shared/config/ts/` - Shared TS configs
  - `base.json` - Base configuration
  - `next.json` - Next.js specific
  - `node.json` - Node.js specific
- **Each package**: Own `tsconfig.json` extending from shared configs

#### Tailwind Configuration

- **Shared**: `shared/config/tailwind/index.cjs` - Base Tailwind config
- **Web**: `app/web/tailwind.config.js` - Extends shared config
- **Admin**: `app/admin/tailwind.config.js` - Extends shared config

#### Prettier Configuration

Root `.prettierrc.json`:
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Database Migrations

#### Migration Workflow Overview

Prisma migrations are stored in `app/server/prisma/migrations/` and tracked in the `_prisma_migrations` table.

#### Standard Workflow (Recommended)

**For most schema changes, use the standard workflow:**

1. **Modify the schema**:
   ```bash
   # Edit app/server/prisma/schema.prisma
   # Example: Add a field to User model
   ```

2. **Create and apply migration**:
   ```bash
   # From root
   npm run db:migrate
   
   # Or from server directory
   cd app/server
   npm run db:migrate
   
   # Or directly with Prisma
   npx prisma migrate dev --name add_phone_to_users
   ```

3. **What happens automatically**:
   - Creates migration file in `prisma/migrations/TIMESTAMP_name/`
   - Applies the migration to your database
   - Regenerates Prisma Client
   - Updates `_prisma_migrations` table

**Example**:
```bash
# 1. Edit schema.prisma:
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  phone String? // <- Added this field
}

# 2. Create migration:
npx prisma migrate dev --name add_phone_field

# Output:
# ✔ Prisma schema loaded
# ✔ Migration created: 20260120123456_add_phone_field
# ✔ Migration applied
# ✔ Prisma Client generated
```

#### Manual Migration Creation (Advanced)

**Use when you need custom SQL (data transformations, conditional logic, etc.):**

1. **Create migration without applying**:
   ```bash
   npx prisma migrate dev --create-only --name custom_migration_name
   ```

2. **Edit the SQL file**:
   ```bash
   # File location: prisma/migrations/TIMESTAMP_name/migration.sql
   # Add your custom SQL
   ```

3. **Apply the migration**:
   ```bash
   npx prisma migrate dev
   ```

**Example - Backfilling Data**:
```sql
-- migration.sql
-- Prisma auto-generates this:
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';

-- You add this manually:
UPDATE "users" SET "role" = 'admin' WHERE "email" = 'admin@example.com';
```

#### Production Deployments

**Never use `migrate dev` in production!** Use `migrate deploy` instead:

```bash
# Production deployment
npm run db:migrate:deploy

# Or directly
npx prisma migrate deploy --schema ./prisma/schema.prisma
```

**Differences**:
- `migrate dev`: Creates migrations, applies them, regenerates client
- `migrate deploy`: Only applies existing migrations (no creation)

#### Common Migration Commands

```bash
# Create and apply migration
npm run db:migrate

# Apply migrations (production)
npm run db:migrate:deploy

# Reset database (WARNING: deletes all data)
npm run db:migrate:reset

# Check migration status
npx prisma migrate status

# Generate Prisma Client only (no migrations)
npm run db:generate

# View database in GUI
npm run db:studio
```

#### Migration Examples

**Example 1: Add a new table**:
```prisma
// schema.prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now()) @map("created_at")
  
  @@map("posts")
}
```
```bash
npx prisma migrate dev --name add_posts_table
```

**Example 2: Add index for performance**:
```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  
  @@index([email]) // Add index
}
```
```bash
npx prisma migrate dev --name add_email_index
```

**Example 3: Make field required (with existing data)**:
```bash
# 1. Add field as optional
model User {
  phone String? // Optional first
}
npx prisma migrate dev --name add_phone_optional

# 2. Backfill data in your app or with SQL

# 3. Make it required
model User {
  phone String // Now required
}
npx prisma migrate dev --create-only --name make_phone_required

# 4. Edit migration.sql to handle existing NULL values
ALTER TABLE "users" ALTER COLUMN "phone" SET DEFAULT 'unknown';
UPDATE "users" SET "phone" = 'unknown' WHERE "phone" IS NULL;
ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL;

# 5. Apply
npx prisma migrate dev
```

#### Important Notes

- ✅ **Always modify `schema.prisma` first**, then create migration
- ✅ **Use descriptive migration names**: `add_user_role`, not `migration_1`
- ✅ **Review generated SQL** before applying in production
- ✅ **Test migrations** on a copy of production data
- ❌ **Never manually create migration files** without Prisma CLI
- ❌ **Never edit applied migrations** - create a new one instead
- ❌ **Never use `migrate dev` in production** - use `migrate deploy`

#### Troubleshooting Migrations

**Migration failed - what now?**
```bash
# 1. Check migration status
npx prisma migrate status

# 2. If failed, mark as rolled back
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# 3. Fix the issue and try again
npx prisma migrate dev
```

**Schema and database out of sync?**
```bash
# Option 1: Create a new migration
npx prisma migrate dev --name sync_schema

# Option 2: Reset (development only - DELETES DATA)
npm run db:migrate:reset
```

**Prisma Client out of sync?**
```bash
# Regenerate Prisma Client
npm run db:generate
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:3000/api-docs`

The Swagger documentation is auto-generated from your route schemas and Zod validations.

## 📱 Mobile App

The mobile app is built with **Expo** and **React Native**, providing a cross-platform mobile experience for iOS, Android, and web.

### Features

- **Expo Router** - File-based routing system
- **TypeScript** - Type-safe development
- **React Native Maps** - Native map integration
- **React Query** - Server state management
- **Zustand** - Client state management
- **Zod** - Schema validation
- **React Hook Form** - Form handling
- **Expo Modules** - Native functionality (camera, location, etc.)

### Setup & Development

#### Prerequisites

- **iOS Development**: macOS with Xcode installed
- **Android Development**: Android Studio with emulator configured
- **Expo Go**: For quick testing on physical devices (download from App Store/Play Store)

#### Running the Mobile App

From the **monorepo root**:

```bash
# Start Expo development server
npm run dev:mobile

# Run on specific platforms
npm run mobile:android  # Run on Android emulator
npm run mobile:ios      # Run on iOS simulator
npm run mobile:web      # Run in web browser
```

Or from the **mobile-app directory** (`app/mobile-app`):

```bash
npm run start    # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run in web
```

#### Building for Production

```bash
cd app/mobile-app

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

#### Configuration

The mobile app configuration is in `app/mobile-app/app.json`:

- **App name**: ParkNest | Driveway Parking
- **Bundle ID**: com.park.nest.app
- **Scheme**: parknest
- **Expo Router**: Enabled with typed routes
- **New Architecture**: Enabled

#### Google Services

The app includes Google Maps integration:

- **iOS**: `ParkNest Google Service Info.plist`
- **Android**: `ParkNest Google Services.json`

**Note**: These files contain API keys and should be configured with your own credentials.

#### Patches

The app uses `patch-package` for npm package modifications:

```bash
# Patches are automatically applied after npm install
# Located in: app/mobile-app/patches/
```

### Mobile App Structure

```
app/mobile-app/
├── src/                  # Source code
│   ├── app/              # Expo Router pages (file-based routing)
│   ├── components/       # Reusable components
│   ├── assets/           # Images, fonts, etc.
│   └── ...
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── patches/              # Package patches
```

### Connecting to Backend

Update the API endpoint in your mobile app configuration to connect to the backend server:

```typescript
// Example: src/config/api.ts
const API_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development
  : 'https://your-api.com';  // Production
```

## 🗄️ Database

### Prisma Schema

Define your database models in `prisma/schema.prisma`. Example:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  status    UserStatus @default(Active)
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  @@map("users")
}
```

### Using Prisma in Controllers

```typescript
import { prisma } from '../../../db';

// Find all
const users = await prisma.user.findMany();

// Find one
const user = await prisma.user.findUnique({
  where: { id: 1 },
});

// Create
const newUser = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
  },
});

// Update
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Jane Doe' },
});

// Delete
await prisma.user.delete({
  where: { id: 1 },
});
```

## 🔒 Security Features

- **Helmet** - Security headers (XSS protection, content security policy, etc.)
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents abuse with configurable limits
- **Input Validation** - Zod schema validation on all requests

## 📝 Adding New Features

### Complete Feature Development Guide

#### 1. Backend API Endpoint

**Step 1: Create Database Model** (if needed)

```prisma
// app/server/prisma/schema.prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@map("products")
}
```

```bash
# Create migration
npx prisma migrate dev --name add_products_table
```

**Step 2: Create Validation Schemas**

```typescript
// app/server/schemas/productSchemas.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
});

export const productResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;

// Export for Swagger
export { createProductSchema, productResponseSchema };
```

**Step 3: Create Controllers**

```typescript
// app/server/routes/productRoutes/controllers/getProducts.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../db';
import { HttpError } from '../../../utils/HttpError';

export async function getProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return reply.status(200).send(products);
  } catch (error) {
    request.log.error(error);
    throw new HttpError(500, 'Failed to fetch products');
  }
}
```

```typescript
// app/server/routes/productRoutes/controllers/createProduct.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../db';
import { HttpError } from '../../../utils/HttpError';
import { CreateProductInput } from '../../../schemas/productSchemas';

export async function createProduct(
  request: FastifyRequest<{ Body: CreateProductInput }>,
  reply: FastifyReply
) {
  try {
    const product = await prisma.product.create({
      data: request.body,
    });
    
    return reply.status(201).send(product);
  } catch (error) {
    request.log.error(error);
    throw new HttpError(500, 'Failed to create product');
  }
}
```

**Step 4: Create Route Definition**

```typescript
// app/server/routes/productRoutes/productRoutes.ts
import { FastifyInstance } from 'fastify';
import { getProducts } from './controllers/getProducts';
import { createProduct } from './controllers/createProduct';
import { 
  createProductSchema, 
  productResponseSchema 
} from '../../schemas/productSchemas';

export async function productRoutes(fastify: FastifyInstance) {
  // GET /api/products
  fastify.get('/products', {
    schema: {
      description: 'Get all products',
      tags: ['Products'],
      response: {
        200: z.array(productResponseSchema),
      },
    },
  }, getProducts);

  // POST /api/products
  fastify.post('/products', {
    schema: {
      description: 'Create a new product',
      tags: ['Products'],
      body: createProductSchema,
      response: {
        201: productResponseSchema,
      },
    },
  }, createProduct);
}
```

**Step 5: Register Routes**

```typescript
// app/server/routes/index.ts
import { FastifyInstance } from 'fastify';
import { healthRoutes } from './healthRoutes/healthRoutes';
import { authRoutes } from './authRoutes/authRoutes';
import { userRoutes } from './userRoutes/userRoutes';
import { productRoutes } from './productRoutes/productRoutes'; // Add this

export async function routes(fastify: FastifyInstance) {
  await fastify.register(healthRoutes, { prefix: '/api' });
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(userRoutes, { prefix: '/api/users' });
  await fastify.register(productRoutes, { prefix: '/api' }); // Add this
}
```

#### 2. Frontend Integration (Web/Admin)

**Step 1: Create API Service**

```typescript
// app/web/src/helpers/api.ts (or app/admin/src/helpers/api.ts)
import { apiRequest } from './apiRequest';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
}

export const productApi = {
  getAll: () => apiRequest.get<Product[]>('/api/products'),
  
  create: (data: CreateProductData) => 
    apiRequest.post<Product>('/api/products', data),
};
```

**Step 2: Create Component**

```typescript
// app/web/src/components/products/ProductList.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/helpers/api';

export function ProductList() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productApi.getAll,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products?.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Step 3: Create Form Component**

```typescript
// app/web/src/components/products/CreateProductForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/helpers/api';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
});

type FormData = z.infer<typeof schema>;

export function CreateProductForm() {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors }, reset } = 
    useForm<FormData>({
      resolver: zodResolver(schema),
    });

  const mutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      reset();
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Product name" />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('description')} placeholder="Description" />
      
      <input 
        {...register('price', { valueAsNumber: true })} 
        type="number" 
        step="0.01"
        placeholder="Price" 
      />
      {errors.price && <span>{errors.price.message}</span>}
      
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

**Step 4: Use in Page**

```typescript
// app/web/src/app/products/page.tsx
import { ProductList } from '@/components/products/ProductList';
import { CreateProductForm } from '@/components/products/CreateProductForm';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <CreateProductForm />
      <ProductList />
    </div>
  );
}
```

#### 3. Mobile App Integration

**Step 1: Create Service**

```typescript
// app/mobile-app/src/services/productService.ts
import { ApiRequestHandler } from '@/helpers/ApiRequestHandler';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await ApiRequestHandler.get('/api/products');
    return response.data;
  },
  
  create: async (data: Omit<Product, 'id'>): Promise<Product> => {
    const response = await ApiRequestHandler.post('/api/products', data);
    return response.data;
  },
};
```

**Step 2: Create Screen Component**

```typescript
// app/mobile-app/src/components/Products/index.tsx
import { View, Text, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';

export function ProductsScreen() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

**Step 3: Create Screen Route**

```typescript
// app/mobile-app/src/app/products.tsx
import { ProductsScreen } from '@/components/Products';

export default function ProductsRoute() {
  return <ProductsScreen />;
}
```

#### Feature Development Checklist

- [ ] Define database model in Prisma schema
- [ ] Create and apply migration
- [ ] Create Zod validation schemas
- [ ] Create controller functions
- [ ] Create route definitions with schemas
- [ ] Register routes in routes index
- [ ] Test API with Swagger UI or Postman
- [ ] Create frontend API service
- [ ] Create frontend components
- [ ] Add pages/routes
- [ ] Test end-to-end functionality
- [ ] Update documentation if needed

## 🐛 Troubleshooting

### Database Issues

#### Connection Failed

**Problem**: Cannot connect to PostgreSQL

**Solutions**:
```bash
# 1. Check if container is running
docker ps

# 2. Start the database
npm run db:up

# 3. Check logs
npm run db:logs

# 4. Test connection
npm run db:test

# 5. If still failing, reset database
npm run db:reset
```

**Check environment variables**:
- Verify `DATABASE_URL` in `.env`
- Ensure `POSTGRES_HOST`, `POSTGRES_PORT`, etc. are correct
- For Docker: use `localhost` or `127.0.0.1`

#### Prisma Client Out of Sync

**Problem**: Type errors or "Prisma Client not found"

**Solutions**:
```bash
# 1. Regenerate Prisma Client
npm run db:generate

# 2. If still failing, clean and reinstall
rm -rf node_modules app/server/node_modules
npm install

# 3. Regenerate again
npm run db:generate
```

#### Migration Failed

**Problem**: Migration failed to apply

**Solutions**:
```bash
# 1. Check migration status
npx prisma migrate status

# 2. Mark failed migration as rolled back
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# 3. Fix the issue and retry
npx prisma migrate dev

# 4. If all else fails (development only - DELETES DATA)
npm run db:migrate:reset
```

### Build Issues

#### TypeScript Errors

**Problem**: Type errors after pulling changes

**Solutions**:
```bash
# 1. Reinstall dependencies
npm install

# 2. Regenerate Prisma Client (if using server)
npm run db:generate

# 3. Check TypeScript
npm run type-check:server
npm run type-check:web

# 4. Clear TypeScript cache
rm -rf **/*.tsbuildinfo
```

#### Module Not Found

**Problem**: Cannot find module '@shared/ui' or similar

**Solutions**:
```bash
# 1. Install dependencies from root
npm install

# 2. Check package.json workspace configuration
# Should have: "workspaces": ["app/*", "shared/*"]

# 3. If using VSCode, reload window
# Cmd+Shift+P -> "Reload Window"
```

### Server Issues

#### Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::3000`

**Solutions**:
```bash
# Find and kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
# Edit app/server/.env: PORT=3001
```

#### Fastify Won't Start

**Problem**: Server crashes on startup

**Solutions**:
```bash
# 1. Check environment variables
cat app/server/.env

# 2. Ensure database is running
npm run db:up

# 3. Check server logs for specific error
npm -w app/server run dev

# 4. Verify Prisma Client is generated
npm run db:generate
```

### Frontend Issues

#### Blank Page / Nothing Renders

**Problem**: Web or admin app shows blank page

**Solutions**:
```bash
# 1. Check browser console for errors

# 2. Verify API URL in helpers/constants.ts
# Should be: http://localhost:3000

# 3. Restart dev server
# Ctrl+C to stop, then:
npm run dev:web  # or dev:admin

# 4. Clear browser cache
# Hard reload: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

#### CORS Errors

**Problem**: "Access-Control-Allow-Origin" error

**Solutions**:
```typescript
// Check app/server/plugins/cors.ts
// Add your frontend URL to origin array:
origin: [
  'http://localhost:3001',  // Web app
  'http://localhost:5173',  // Admin
  'http://localhost:8081',  // Expo web
]
```

#### API Calls Fail

**Problem**: Network errors or 404 on API calls

**Solutions**:
```bash
# 1. Verify backend is running
curl http://localhost:3000/api/health

# 2. Check API URL in frontend config
# Web: src/helpers/constants.ts
# Admin: src/helpers/constants.ts

# 3. Check if endpoint exists in Swagger
# http://localhost:3000/api-docs
```

### Mobile App Issues

#### Expo Won't Start

**Problem**: `expo start` fails

**Solutions**:
```bash
# 1. Clear Expo cache
npm -w app/mobile-app run dev -- -c

# 2. Delete and reinstall
cd app/mobile-app
rm -rf node_modules
npm install

# 3. Clear watchman cache (macOS/Linux)
watchman watch-del-all

# 4. Reset Metro bundler
rm -rf .expo
```

#### Can't Connect to API

**Problem**: Mobile app can't reach backend

**Solutions**:
```bash
# 1. For iOS Simulator/Android Emulator
# Use your computer's local IP, not localhost
# Find your IP:
ipconfig getifaddr en0  # macOS
ifconfig                # Linux
ipconfig                # Windows

# 2. Update .env file
# API_URL=http://192.168.1.XXX:3000

# 3. For Expo Go on physical device
# Ensure phone and computer are on same WiFi
```

#### Build Errors

**Problem**: EAS build fails

**Solutions**:
```bash
# 1. Verify eas.json configuration
cat app/mobile-app/eas.json

# 2. Check app.json for errors
cat app/mobile-app/app.json

# 3. Ensure all native modules are compatible
npm -w app/mobile-app run prebuild

# 4. Check EAS build logs for specific error
eas build:list
```

### npm/Package Issues

#### Lock File Conflicts

**Problem**: Merge conflicts in package-lock.json

**Solutions**:
```bash
# 1. Delete lock file and node_modules
rm -rf package-lock.json node_modules
rm -rf app/*/node_modules

# 2. Reinstall
npm install

# 3. Commit new lock file
git add package-lock.json
git commit -m "chore: update package-lock.json"
```

#### Peer Dependency Warnings

**Problem**: npm install shows peer dependency warnings

**Solutions**:
- Most peer dependency warnings can be ignored
- If you see `ERESOLVE` errors, check `package.json` for `overrides`
- Current overrides force React 19 across all packages

### Git/Husky Issues

#### Pre-commit Hook Fails

**Problem**: Commit rejected by pre-commit hook

**Solutions**:
```bash
# 1. Run linter manually to see errors
npm run lint:staged

# 2. Auto-fix linting issues
npm run lint:server
npm run lint:web
npm run lint:admin

# 3. If you need to skip (not recommended)
git commit --no-verify -m "message"
```

#### Husky Not Running

**Problem**: Hooks not triggering

**Solutions**:
```bash
# 1. Reinstall Husky
npm install

# 2. Verify .husky directory exists
ls -la .husky

# 3. Ensure hooks are executable
chmod +x .husky/*
```

### Performance Issues

#### Slow Server Response

**Solutions**:
- Add database indexes to frequently queried fields
- Use `prisma.user.findUnique()` instead of `findMany()` when possible
- Implement pagination for large datasets
- Check slow query logs

#### Frontend Slow to Load

**Solutions**:
- Use React Query caching effectively
- Implement code splitting (dynamic imports)
- Optimize images (use Next.js Image component)
- Check Network tab in DevTools for slow requests

### Common Error Messages

**"Cannot find module '@prisma/client'"**
```bash
npm run db:generate
```

**"Port 3000 is already in use"**
```bash
lsof -ti:3000 | xargs kill -9
```

**"No Prisma schema found"**
```bash
# Ensure you're running commands from correct directory
cd app/server
```

**"Migration is ahead of the database"**
```bash
npm run db:migrate:deploy
```

**"ECONNREFUSED 127.0.0.1:5432"**
```bash
npm run db:up
```

**"Expo Go crashes on launch"**
```bash
# Clear cache and restart
expo start -c
```

### Still Having Issues?

1. Check the specific error message in console/terminal
2. Search the error in GitHub Issues
3. Check Swagger docs: `http://localhost:3000/api-docs`
4. Use Prisma Studio to inspect database: `npm run db:studio`
5. Enable verbose logging in server: `NODE_ENV=development`
6. Open an issue with detailed error logs

## 🤖 AI Development Guidelines

This section provides context and guidelines for AI assistants working with this codebase.

### Codebase Overview

**Type**: Full-stack TypeScript monorepo with npm workspaces
**Structure**: Multi-app (server, web, admin, mobile) + shared packages
**Package Manager**: npm (not yarn or pnpm)
**Node Version**: 20+

### Workspace Structure

```
monorepo-root/
├── app/
│   ├── server/          # Fastify backend (port 3000)
│   ├── web/             # Next.js web app (port 3001)
│   ├── admin/           # Vite React admin (port 5173)
│   └── mobile-app/      # Expo mobile app
└── shared/
    ├── ui/              # @shared/ui
    ├── schemas/         # @shared/schemas
    └── config/          # @repo/config
```

### Running Commands

**From Root**:
- Use `npm -w app/server run <script>` to run server scripts
- Use `npm -w app/web run <script>` to run web scripts
- Use `npm -w app/admin run <script>` to run admin scripts
- Use `npm -w app/mobile-app run <script>` to run mobile scripts

**From Package Directory**:
- Navigate to specific package and run `npm run <script>`

### Backend Development

#### Route Creation Pattern

When creating new routes, follow this structure:

```typescript
// routes/featureName/featureRoutes.ts
import { FastifyInstance } from 'fastify';
import { getController } from './controllers/getController';
import { createController } from './controllers/createController';
import { someSchema } from '../../schemas/featureSchemas';

export async function featureRoutes(fastify: FastifyInstance) {
  // GET endpoint
  fastify.get('/feature', {
    schema: {
      description: 'Description for Swagger',
      tags: ['Feature'],
      response: {
        200: someSchema,
      },
    },
  }, getController);

  // POST endpoint
  fastify.post('/feature', {
    schema: {
      description: 'Create feature',
      tags: ['Feature'],
      body: someSchema,
      response: {
        201: someSchema,
      },
    },
  }, createController);
}
```

#### Controller Pattern

```typescript
// routes/featureName/controllers/getController.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../db';
import { HttpError } from '../../../utils/HttpError';

export async function getController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = await prisma.model.findMany();
    return reply.status(200).send(data);
  } catch (error) {
    throw new HttpError(500, 'Failed to fetch data');
  }
}
```

#### Schema Pattern

```typescript
// schemas/featureSchemas.ts
import { z } from 'zod';

export const createFeatureSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
```

#### Database Access

- Always import `prisma` from `src/db`
- Use Prisma Client methods: `findMany`, `findUnique`, `create`, `update`, `delete`
- Always handle errors with try-catch or throw HttpError

#### Adding New Models

1. Edit `app/server/prisma/schema.prisma`
2. Run `npm run db:migrate` from root (or `npm run db:migrate` from server)
3. Prisma Client auto-regenerates

#### Authentication

- Use `isAuthenticated` middleware from `middleware/isAuthenticated.ts`
- JWT tokens are verified automatically
- User info available in `request.user` after authentication

### Frontend Development (Web & Admin)

#### Component Structure

```typescript
// components/Feature/FeatureComponent.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/helpers/apiRequest';

export function FeatureComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['feature'],
    queryFn: () => apiRequest.get('/api/feature'),
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* component JSX */}</div>;
}
```

#### API Calls

- Use `apiRequest` helper from `helpers/apiRequest.ts`
- Always use TanStack Query for server state
- Handle loading, error, and success states

#### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

### Mobile Development

#### Screen/Page Pattern

```typescript
// app/(home)/feature.tsx
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';

export default function FeatureScreen() {
  const { data } = useQuery({
    queryKey: ['feature'],
    queryFn: fetchFeature,
  });

  return (
    <View>
      <Text>{data?.name}</Text>
    </View>
  );
}
```

#### Navigation

- Use Expo Router file-based routing
- Navigate with `router.push('/path')`
- Group routes with `(groupName)` folders

#### State Management

- Server state: TanStack Query
- Client state: Zustand stores
- Local storage: MMKV

### Shared Packages

#### Adding to Shared UI

```typescript
// shared/ui/src/components/NewComponent.tsx
export function NewComponent({ title }: { title: string }) {
  return <div>{title}</div>;
}

// shared/ui/src/index.ts
export * from './components/NewComponent';
```

Usage in apps:
```typescript
import { NewComponent } from '@shared/ui';
```

### Type Safety Rules

1. **Never use `any` type** - Always create proper types/interfaces
2. **Use Zod for validation** - Infer types from Zod schemas
3. **Type all function parameters and returns**
4. **Use TypeScript strict mode** (already enabled)

### Code Style

1. **Use named exports** (not default exports) except for Next.js pages and Expo Router screens
2. **Use async/await** (not promises with .then())
3. **Handle errors explicitly** with try-catch
4. **Use const** over let when possible
5. **Add JSDoc comments** for complex functions

### Common Patterns

#### Error Handling

```typescript
// Backend
throw new HttpError(400, 'Invalid input');

// Frontend
try {
  await apiRequest.post('/api/endpoint', data);
} catch (error) {
  console.error(error);
  // Show toast/alert
}
```

#### Authentication Check

```typescript
// Backend route
fastify.get('/protected', {
  preHandler: [isAuthenticated],
}, controller);

// Frontend
const { user } = useUser();
if (!user) return <Navigate to="/login" />;
```

#### Query Keys

Use hierarchical query keys:
```typescript
['users']              // All users
['users', userId]      // Specific user
['users', userId, 'posts'] // User's posts
```

### Database Schema Changes

1. **Modify schema**: Edit `prisma/schema.prisma`
2. **Create migration**: `npx prisma migrate dev --name description`
3. **Apply in production**: `npm run db:migrate:deploy`

### Testing Strategy

- **Backend**: Test controllers independently
- **Frontend**: Test components with React Testing Library
- **E2E**: Use Playwright (not yet implemented)

### Performance Guidelines

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Use React Query caching effectively
- Optimize images with Next.js Image component
- Use Expo Image for mobile

### Security Considerations

- **Never commit secrets** to git
- **Validate all inputs** with Zod schemas
- **Use prepared statements** (Prisma does this automatically)
- **Implement rate limiting** on sensitive endpoints
- **Use HTTPS** in production

### Common Commands Reference

```bash
# Root commands
npm run dev                 # Start all apps
npm run db:up               # Start database
npm run db:generate         # Generate Prisma Client
npm run lint:staged         # Lint changed files

# Server commands
npm -w app/server run dev
npm -w app/server run db:migrate
npm -w app/server run db:studio

# Web/Admin commands
npm -w app/web run dev
npm -w app/admin run dev

# Mobile commands
npm -w app/mobile-app run dev
npm -w app/mobile-app run ios
npm -w app/mobile-app run android
```

### File Organization

- **One component per file**
- **Colocate related files** (component + styles + types)
- **Use index.ts** for clean exports
- **Group by feature**, not by type

### Git Workflow

- **Branch naming**: `feature/description`, `fix/description`
- **Commits**: Clear, descriptive messages
- **Pre-commit hooks**: Automatically lint staged files
- **No direct pushes** to main branch

### When Adding New Features

1. **Plan the feature**: Identify affected packages
2. **Create routes/pages**: Follow existing patterns
3. **Add validation schemas**: Use Zod
4. **Update database** if needed with migrations
5. **Test thoroughly** in all affected apps
6. **Update documentation** if adding new patterns

### Debugging Tips

- **Backend**: Check logs in terminal, use `console.log` or debugger
- **Prisma**: Use `npm run db:studio` to inspect database
- **Frontend**: React DevTools + Network tab
- **Mobile**: React Native Debugger or Expo DevTools

### Common Issues & Solutions

**Prisma Client out of sync**:
```bash
npm run db:generate
```

**Port already in use**:
```bash
# Kill process on port 3000 (example)
lsof -ti:3000 | xargs kill -9
```

**Module resolution errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Mobile app won't start**:
```bash
# Clear Expo cache
npm run dev -- -c
```

### Best Practices Summary

- ✅ Use TypeScript strictly, no `any`
- ✅ Validate with Zod schemas
- ✅ Use TanStack Query for server state
- ✅ Follow the established patterns
- ✅ Write descriptive variable/function names
- ✅ Handle errors explicitly
- ✅ Keep components small and focused
- ✅ Use shared packages to avoid duplication
- ✅ Document complex logic
- ✅ Test critical paths

## 📄 License

ISC

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure linting passes: `npm run lint:staged`
4. Ensure TypeScript compiles: `npm run type-check:server` and `npm run type-check:web`
5. Test in all affected apps
6. Submit a pull request with clear description

## 📞 Support

For issues and questions, please open an issue on the repository.
