# Web App (Next.js)

Next.js 15 web application with App Router, Material-UI (MUI), Tailwind CSS, TanStack Query, and shared `@repo` packages.

## Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI**: Material-UI (MUI), Tailwind CSS, SCSS
- **Data**: TanStack Query (React Query), `axios`
- **Forms**: React Hook Form, Zod (`@hookform/resolvers`)
- **Payments**: Stripe
- **Realtime**: Socket.io client
- **Theming**: `next-themes` (dark/light)
- **Dates**: `date-fns`, `moment`

## Structure

```
src/
├── app/                 # App Router pages & layouts
│   ├── layout.tsx       # Root layout (ConfigWrapper, theme)
│   ├── page.tsx         # Home
│   ├── demo/            # Demo pages
│   ├── privacy-policy/
│   └── terms-of-service/
├── common/              # Shared wrappers
│   ├── configWrapper/   # QueryClient, next-themes, MUI, Toaster
│   ├── queryProvider/
│   ├── userProvider/
│   ├── authPageLayout/
│   ├── dashboardLayout/
│   └── dialogWrapper/
├── components/          # React components
├── helpers/             # API & utilities
│   ├── api.ts
│   ├── apiRequest.ts
│   ├── assets.ts
│   └── constants.ts     # CONSTANTS.API_ENDPOINT, etc.
├── interfaces/
├── theme/               # MUI theme
│   ├── ThemeProvider.tsx
│   └── colors.ts
└── styles/
    └── globals.scss
```

## Running the app

### From monorepo root

```bash
npm run dev:web
```

### From this directory

```bash
cd app/web
npm run dev
```

Runs at **http://localhost:3000** by default (or the port Next.js prints).

## Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

`CONSTANTS.API_ENDPOINT` in `src/helpers/constants.ts` reads `process.env.NEXT_PUBLIC_API_ENDPOINT`.

## Scripts

| Script         | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start dev server (Turbopack)   |
| `npm run build`| Production build               |
| `npm run start`| Run production server          |
| `npm run lint` | Run ESLint                     |
| `npm run lint:fix` | ESLint with auto-fix       |
| `npm run type-check` | TypeScript check (no emit) |

## Shared packages

- `@repo/config` – ESLint, Tailwind, TypeScript configs
- `@repo/ui` – transpiled in `next.config.ts` via `transpilePackages: ['@repo/ui']`

## Learn more

- [Next.js 15](https://nextjs.org/docs)
- [MUI](https://mui.com/)
- [TanStack Query](https://tanstack.com/query/latest)
