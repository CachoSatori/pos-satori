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