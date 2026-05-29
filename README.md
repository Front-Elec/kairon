# Kairon

Biblioteca digital moderna y sistema de estudio (MVP para Taller Frontend).

## Stack
- React + Vite + TypeScript
- React Router (latest)
- Tailwind CSS (v4)
- Estado global: Zustand (planificado)
- Testing: Vitest + Testing Library (planificado)
- Deploy: Netlify

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Convención de ramas
- `main`: producción (protegida)
- `develop`: integración
- `feature/*`: 1 rama por issue (ej: `feature/20-books-store`)

## Flujo
- Todo cambio nace como Issue
- Todo PR debe incluir `Closes #N`
- QA aprueba antes de merge

## Netlify (Issue #4)
- Archivo de configuración: `netlify.toml`
- Build command: `npm run build`
- Publish directory: `dist`
- Redirect SPA configurado para React Router (`/* -> /index.html`)

### Checklist de conexión manual en Netlify
1. Importar repositorio `kairon` en Netlify
2. Verificar build command `npm run build`
3. Verificar publish directory `dist`
4. Configurar variable `VITE_API_BASE_URL` en Netlify
5. Confirmar deploy exitoso al mergear a `main`

## Variables de entorno (Issue #5)
- Archivo ejemplo: `.env.example`
- Validación runtime con Zod: `src/config/env.ts`
- Tipado estricto de `import.meta.env`: `src/vite-env.d.ts`

Variable requerida:
- `VITE_API_BASE_URL` (debe ser URL válida)

## ESLint estricto (Issue #6)
- Configuración principal en `eslint.config.js`
- Reglas reforzadas para evitar código muerto:
  - `@typescript-eslint/no-unused-vars: error`
  - `no-unreachable: error`
- El script `npm run build` ejecuta lint antes del build:
  - `npm run lint && tsc -b && vite build`
