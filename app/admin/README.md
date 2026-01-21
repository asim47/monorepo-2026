# Admin Panel (Vite + React)

Vite + React admin app with MUI, React Router, TanStack Query, and MUI X Data Grid.

## Stack

- **Build**: Vite 6
- **UI**: Material-UI (MUI), Tailwind CSS, SCSS
- **Routing**: React Router v6
- **Data**: TanStack Query, `axios`, MUI X Data Grid
- **Charts**: Recharts
- **Forms**: React Hook Form, Zod (`@hookform/resolvers`)
- **Icons**: Lucide React
- **Theming**: `next-themes`
- **Dates**: `date-fns`, `moment`

## Structure

```
src/
├── app/                 # Page components (not file-based router)
│   ├── page.tsx         # Dashboard
│   ├── auth/login/
│   ├── profile/
│   ├── users/
│   ├── admins/
│   └── ...
├── common/              # Shared wrappers
│   ├── configWrapper/   # QueryClient, next-themes, MUI, Toaster
│   ├── queryProvider/
│   ├── userProvider/
│   ├── authPageLayout/
│   ├── dashboardLayout/
│   ├── sidebar/
│   └── dialogWrapper/
├── components/          # Feature components
├── helpers/
│   ├── api.ts
│   ├── apiRequest.ts
│   ├── assets.ts
│   ├── constants.ts     # CONSTANTS.API_ENDPOINT
│   ├── mockApi.ts
│   ├── mockData.ts
│   └── permissions.ts
├── interfaces/
├── layouts/
├── theme/
│   ├── ThemeProvider.tsx
│   └── colors.ts
├── styles/
│   └── globals.scss
├── App.tsx              # Route definitions
└── main.tsx             # Entry (BrowserRouter, ConfigWrapper)
```

## Running the app

### From monorepo root

```bash
npm run dev:admin
```

### From this directory

```bash
cd app/admin
npm run dev
```

Runs at **http://localhost:5173** (Vite default).

## Environment variables

Create `.env` in `app/admin`:

```env
VITE_API_ENDPOINT=http://localhost:8000
```

`CONSTANTS.API_ENDPOINT` in `src/helpers/constants.ts` reads `import.meta.env.VITE_API_ENDPOINT`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc` + `vite build` |
| `npm run preview` | Preview production build |
| `npm run type-check` | `tsc --noEmit` |
| `npm run lint` / `lint:fix` | ESLint |

## Shared packages

- `@repo/config` – ESLint, Tailwind, TypeScript configs

## Learn more

- [Vite](https://vitejs.dev/)
- [MUI](https://mui.com/)
- [MUI X Data Grid](https://mui.com/x/react-data-grid/)
- [React Router](https://reactrouter.com/)
