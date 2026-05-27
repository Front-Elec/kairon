# Bitácora — Kairon

> **Dónde van las capturas:** en el **PDF del informe técnico** (y opcionalmente en un comentario del PR).  
> **No** es obligatorio pegar imágenes dentro del Issue en GitHub; ahí basta texto + link al PR.

---

## Sesión 2026-05-27 — Issue #1

| Campo | Detalle |
|-------|---------|
| **Integrante** | [Alejandro Rodriguez - Sky-787] |
| **Rol** | Integrante 1 — DevOps & Git Flow Lead |
| **Issue** | #1 — Inicializar repositorio y scaffolding base del proyecto |
| **Rama** | `develop` |
| **PR** | [Pegar URL del PR cuando lo abras] |

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

### Evidencia para el PDF (capturas de Pantalla)
| # | Qué captura | Para qué issue |
|---|--------------|----------------|
| 1 | Explorador de archivos / VS Code con carpetas `src/`, `package.json`, `vite.config.ts` | #1 |
| 2 | Terminal después de `npm run lint` (sin errores, termina normal) | #1 |
| 3 | Terminal después de `npm run build` (línea `✓ built in ...`) | #1 |
| 4 | GitHub Issue #1 (descripción + estado Closed) | #1 |
| 5 | Pull Request con `Closes #1` y checks/lista de revisión | #1 |

### Notas
- **Netlify deploy** → Issue #4 (aún no aplica para cerrar #1)
- **Branch protection en `main`** → Issue #2 (configuración en GitHub Settings)
- **Plantilla PR / labels** → Issue #3 (ya adelantada parcialmente con `.github/PULL_REQUEST_TEMPLATE.md`)
