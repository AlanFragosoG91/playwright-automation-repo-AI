# 🎭 Playwright Automation Project

Un proyecto de automatización robusto y escalable usando Playwright con TypeScript.

## 🚀 Configuración Rápida

```bash
# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npm run install:browsers

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo UI
npm run test:ui
```

## 📁 Estructura del Proyecto

```
├── pages/              # Page Objects Pattern
│   ├── base.page.ts    # Clase base para todas las páginas
│   ├── playwright-home.page.ts
│   └── todo.page.ts
├── helpers/            # Utilidades y helpers
│   ├── api.helper.ts   # Helper para pruebas de API
│   └── localStorage.helper.ts
├── fixtures/           # Test fixtures y configuración
│   └── test-fixtures.ts
├── tests/              # Pruebas principales
│   ├── api/           # Pruebas de API
│   ├── playwright-home.spec.ts
│   └── todo-improved.spec.ts
└── tests-examples/     # Ejemplos originales
```

## 🧪 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecuta todas las pruebas |
| `npm run test:headed` | Ejecuta pruebas con navegador visible |
| `npm run test:debug` | Ejecuta pruebas en modo debug |
| `npm run test:ui` | Abre la interfaz de usuario de Playwright |
| `npm run test:chrome` | Ejecuta solo en Chrome |
| `npm run test:firefox` | Ejecuta solo en Firefox |
| `npm run test:webkit` | Ejecuta solo en Safari |
| `npm run test:api` | Ejecuta solo pruebas de API |
| `npm run report` | Abre el reporte HTML |

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y ajusta las variables:

```bash
BASE_URL=https://playwright.dev
TODO_APP_URL=https://demo.playwright.dev/todomvc
API_BASE_URL=https://api.example.com
```

### Configuración de Playwright

La configuración se encuentra en `playwright.config.ts` con:

- ✅ Base URL configurada
- ✅ Timeouts optimizados
- ✅ Múltiples reporters (HTML, JUnit, GitHub)
- ✅ Screenshots y videos en fallos
- ✅ Traces habilitados

## 🏗️ Patrones de Diseño

### Page Objects Pattern

```typescript
import { PlaywrightHomePage } from '../pages/playwright-home.page';

test('example', async ({ page }) => {
  const homePage = new PlaywrightHomePage(page);
  await homePage.goto('/');
  await homePage.clickGetStarted();
});
```

### Test Fixtures

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test('with fixtures', async ({ todoPage, localStorageHelper }) => {
  await todoPage.addTodo('New task');
  await localStorageHelper.waitForTodoCount(1);
});
```

### API Testing

```typescript
test('api test', async ({ apiHelper }) => {
  const result = await apiHelper.get('/api/users');
  await apiHelper.verifyStatus(result, 200);
});
```

## 🔍 Mejores Prácticas Implementadas

### ✅ Localizadores Robustos
- Uso de `getByRole()`, `getByTestId()` y `getByPlaceholder()`
- Evita selectores CSS frágiles
- Implementa esperas inteligentes

### ✅ Manejo de Esperas
- `waitForElement()` personalizado
- `waitForLoadState('networkidle')`
- Timeouts configurables

### ✅ Reutilización de Código
- Page Objects para encapsular funcionalidad
- Helpers para lógica común
- Fixtures para configuración de tests

### ✅ Manejo de Errores
- Screenshots automáticos en fallos
- Traces para debugging
- Manejo robusto de elementos

## 🚀 CI/CD con GitHub Actions

El workflow incluye:

- ✅ Caché de dependencias npm
- ✅ Caché de navegadores Playwright (con instalación condicional)
- ✅ Ejecución en múltiples navegadores
- ✅ Artefactos de reportes y resultados
- ✅ Variables de entorno
- ✅ Cancelación automática de ejecuciones duplicadas
- ✅ Variable CI habilitada para optimizaciones de pruebas

## 🐛 Debugging

### Modo Debug
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui
```

### Screenshots Manuales
```typescript
await page.screenshot({ path: 'debug.png', fullPage: true });
```

### Traces
Los traces se generan automáticamente en fallos. Para verlos:
```bash
npx playwright show-trace trace.zip
```

## 📊 Reportes

### HTML Report
```bash
npm run report
```

### JUnit (CI/CD)
Los reportes JUnit se generan automáticamente en CI para integración con herramientas de reporting.

## 🔄 Contribuir

1. Crea una rama para tu feature
2. Implementa cambios siguiendo los patrones establecidos
3. Añade tests correspondientes
4. Asegúrate de que todos los tests pasan
5. Crea un Pull Request

## 📚 Recursos Útiles

- [Documentación de Playwright](https://playwright.dev/docs/intro)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 🛠️ Troubleshooting

### Problemas Comunes

1. **Navegadores no instalados**
   ```bash
   npm run install:browsers
   ```

2. **Tests lentos**
   - Verifica la configuración de workers en `playwright.config.ts`
   - Usa `--workers=1` para debugging

3. **Elementos no encontrados**
   - Verifica los localizadores
   - Añade esperas apropiadas
   - Usa el modo debug para investigar
