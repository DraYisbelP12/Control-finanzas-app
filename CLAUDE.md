# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Local dev server at http://localhost:5173/Control-finanzas-app/
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

Requires `.env.local` with:
```
VITE_SUPABASE_URL=https://ivfxnpafglgixyaknmxy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_4SCgEd3SQKhkNO5m44pFew_K5HkYfal
```

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.
Live URL: `https://yisbel-finanzas.github.io/Control-finanzas-app/`

Build secrets (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) must exist in the repo's GitHub Actions secrets.

## Architecture

React 18 + Vite 5 SPA deployed to GitHub Pages under the `Yisbel-Finanzas` org. Supabase handles auth, database, and RLS.

**Routing:** `BrowserRouter` with `basename="/Control-finanzas-app"`. Route `/` redirects to `/movimientos`. A `public/404.html` redirects unknown paths back to `index.html` so client-side navigation survives page refreshes on GitHub Pages. `Dashboard.jsx` exists but is not yet wired into `App.jsx`.

**Auth flow:** Supabase invite-only (no open signups). `App.jsx` listens to `onAuthStateChange` and gates all routes behind session check. Unauthenticated users see only `Login`. Password recovery uses `resetPasswordForEmail` with redirect to the GitHub Pages URL.

**Layout:** Fixed top bar (`--topbar-h: 52px`, blue) with hamburger → `SideMenu`. Bottom tab nav (`--bottomnav-h: 64px`). Main content receives `paddingTop: var(--topbar-h)` and `paddingBottom: var(--bottomnav-h)` from `Layout.jsx`.

**Roles:** `administradora` | `auxiliar` — stored in `public.perfiles`. The `usePerfil` hook fetches the current user's profile from `perfiles` by `auth.uid()`. Admin-only UI (delete buttons, config menu) checks `perfil?.rol === 'administradora'`.

**Data conventions:**
- Soft-delete only: `deleted_at` / `deleted_by` columns — never hard DELETE from `movimientos`
- DOP and USD always in separate columns/records, never mixed or consolidated
- All monetary amounts: `monto` (numeric) + `moneda` ('DOP' | 'USD') as separate fields

**Supabase schema key points:**
- `categorias.tipo` check constraint: only `'ingreso'` or `'gasto'`
- `perfiles.rol` check constraint: only `'administradora'` or `'auxiliar'`
- `movimientos` FK: `categoria_id → categorias`, `cuenta_id → cuentas`, `created_by → auth.users`
- New auth users trigger `handle_new_user()` which inserts into `perfiles` with role `'auxiliar'`

**Config module:** `src/pages/config/Categorias.jsx` — CRUD for categories, accessible via `☰` menu only to `administradora`. Route: `/config/categorias`.

## Design System

All styles use CSS custom properties defined in `src/styles/design-system.css`. Component utility classes are in `src/styles/components.css`. Never use raw hex values in components — always use tokens.

**Key tokens:**
- Colors: `--color-primary`, `--color-success`, `--color-danger`, `--color-bg`, `--color-surface`, `--color-text-primary`, `--color-text-muted`, `--color-text-inverse`
- Spacing: `--space-1` through `--space-12` (4px base scale)
- Layout: `--topbar-h: 52px`, `--bottomnav-h: 64px`, `--max-w: 600px`
- Typography: `--text-xs` through `--text-2xl`

**Component classes to use:**
- `.ds-card` — white card with border + shadow
- `.ds-btn .ds-btn-primary` / `.ds-btn-ghost` / `.ds-btn-danger` / `.ds-btn-sm` — buttons
- `.ds-input` — form inputs and selects
- `.ds-label`, `.ds-field`, `.ds-field-hint` — form field wrappers
- `.ds-page-header` — sticky blue page header strip (sticks below topbar via `top: var(--topbar-h)`)
- `.ds-empty` + `.ds-empty-icon` — empty state with SVG icon
- `.ds-section-label` — uppercase section label
- `.ds-sheet-overlay` + `.ds-sheet` — bottom sheet modal
- `.ds-fab` — floating action button
- `.ds-progress-track` + `.ds-progress-fill` — progress bar
- `.ds-badge .ds-badge-success` / `-danger` / `-warning` / `-primary` — status badges

**Financial numbers** must use `fontVariantNumeric: 'tabular-nums'` inline style.

## Icon System

All icons live in `src/components/icons/NavIcons.jsx` as inline SVG components with a `size` prop and `aria-hidden="true"`. Never use emoji as structural UI elements.

Available icons: `IconMoney`, `IconBank`, `IconList`, `IconChart`, `IconMenu`, `IconWallet`, `IconCalendar`, `IconCash`, `IconCreditCard`, `IconRepeat`, `IconX`, `IconPlus`, `IconEye`, `IconEyeOff`.

When adding a new icon, add it to `NavIcons.jsx` following the same pattern (SVG with `stroke="currentColor"`, `fill="none"`, `aria-hidden="true"`).
