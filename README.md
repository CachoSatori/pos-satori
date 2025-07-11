# pos-satori

Sistema de Pos para Restaurante Sushi  
probando deployment

---

## React + TypeScript + Vite

Este proyecto utiliza una plantilla mínima para trabajar con React en Vite con HMR y algunas reglas de ESLint.

Actualmente, hay dos plugins oficiales disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh.

### Expandiendo la configuración de ESLint

Si desarrollas una aplicación para producción, te recomendamos actualizar la configuración para habilitar reglas dependientes de tipos:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Otros configs...

      // Remueve tseslint.configs.recommended y reemplázalo con esto
      ...tseslint.configs.recommendedTypeChecked,
      // Alternativamente, usa esto para reglas más estrictas
      ...tseslint.configs.strictTypeChecked,
      // Opcionalmente, agrega esto para reglas de estilo
      ...tseslint.configs.stylisticTypeChecked,

      // Otros configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // otras opciones...
    },
  },
])
```

También puedes instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) y [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para reglas específicas de React:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Otros configs...
      // Habilita reglas para React
      reactX.configs['recommended-typescript'],
      // Habilita reglas para React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // otras opciones...
    },
  },
])
```

## Revisión Final SDD

- Cumplidos: Cloud-first, mobile-first, offline, i18n, seguridad PCI, escalabilidad, observabilidad, lazy loading, CI/CD, tests unitarios y E2E, reportes con filtros.
- Pendientes: Ninguno – proyecto completo.

## Deployment Production

1. Set secrets in GitHub repo: `SENTRY_AUTH_TOKEN`, `FIREBASE_SERVICE_ACCOUNT`.
2. Push to `main`: Esto dispara el workflow de CI/CD (lint, tests, build, deploy).
3. Verifica el deployment en [https://pos-satori.web.app](https://pos-satori.web.app) (ajusta la URL si tu proyecto usa otra).
4. En Sentry, configura alertas para errores críticos (por ejemplo, email para excepciones no manejadas).
5. Monitorea errores y performance desde el dashboard de Sentry.
6. Para rollback, haz revert en GitHub y push a `main`.

---

**Apply to editor:**  
Agrega esta sección al final de tu `README.md` para documentar el proceso de deployment a producción y monitoreo.