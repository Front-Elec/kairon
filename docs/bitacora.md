# Bitácora — Kairon

> **Dónde van las capturas:** en el **PDF del informe técnico** (y opcionalmente en un comentario del PR).  
> **No** es obligatorio pegar imágenes dentro del Issue en GitHub; ahí basta texto + link al PR.

---

## Sesión 2026-05-27 — Issue #1

| Campo | Detalle |
|-------|---------|
| **Integrante** | Alejandro Rodriguez - Sky-787 |
| **Rol** | Integrante 1 — DevOps & Git Flow Lead |
| **Issue** | #1 — Inicializar repositorio y scaffolding base del proyecto |
| **Rama** | `develop` |
| **PR** | [Pegar URL del PR cuando esté mergeado] |

### Trabajo realizado
- Scaffold React + Vite + TypeScript en la raíz del repo `kairon`
- Estructura de carpetas: `src/pages`, `src/components`, `src/store`, `src/hooks`, `src/types`, `src/config`
- `README.md` actualizado con stack y convención de ramas
- Rama `develop` creada para integración

### Comandos ejecutados (evidencia en terminal)
```bash
npm install
npm run lint
npm run build
```

### Evidencia para el PDF (capturas de pantalla)
| # | Qué capturar | Issue |
|---|--------------|-------|
| 1 | Explorador de archivos / VS Code con carpetas `src/`, `package.json`, `vite.config.ts` | #1 |
| 2 | Terminal después de `npm run lint` (sin errores) | #1 |
| 3 | Terminal después de `npm run build` (línea `✓ built in ...`) | #1 |
| 4 | GitHub Issue #1 (estado Closed) | #1 |
| 5 | Pull Request con `Closes #1` | #1 |

---

## Sesión 2026-05-27 — Issue #2

| Campo | Detalle |
|-------|---------|
| **Integrante** | Alejandro Rodriguez - Sky-787 |
| **Rol** | Integrante 1 — DevOps & Git Flow Lead |
| **Issue** | #2 — Configurar protección de rama `main` y estrategia de branches |
| **Rama** | `feature/issue-2-branch-protection` |
| **PR** | [Pegar URL del PR al crearlo] |

### Trabajo realizado
- Reglamento de rama en GitHub: **Proteger main - Kairon**
- Rama objetivo: `main`
- Reglas activas:
  - Requiere Pull Request antes de merge
  - Mínimo **1 aprobación** requerida (equipo QA para revisión)
  - Bloqueo de force push
  - Restricción de eliminación de rama
- Convención documentada en `README.md`: `main` / `develop` / `feature/*`

### Evidencia para el PDF (capturas de pantalla)
| # | Qué capturar | Issue |
|---|--------------|-------|
| 1 | GitHub → Settings → Rules: reglamento **Proteger main - Kairon** activo | #2 |
| 2 | Detalle del reglamento con rama `main` y reglas marcadas | #2 |
| 3 | Detalle de “Requiere PR” con **1 aprobación** | #2 |
| 4 | GitHub Issue #2 (estado Closed) | #2 |
| 5 | Pull Request con `Closes #2` aprobado por QA | #2 |
| 6 | (Opcional) Terminal con push directo a `main` rechazado | #2 |

### Notas
- **Netlify deploy** → Issue #4
- **Plantilla PR / labels** → Issue #3
