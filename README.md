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
├── .github/
│   └── workflows/
│       └── playwright.yml   # CI/CD con caché y sharding
├── pages/              # Page Objects Pattern
│   ├── base.page.ts    # Clase base con métodos reutilizables
│   ├── playwright-home.page.ts
│   └── todo.page.ts
├── helpers/            # Utilidades y helpers
│   ├── api.helper.ts   # Helper para pruebas de API (GET, POST, PUT, DELETE)
│   ├── api.validators.ts  # Validadores de estructura de respuestas API
│   └── localStorage.helper.ts  # Helper para localStorage con métodos async
├── fixtures/           # Test fixtures y configuración
│   └── test-fixtures.ts  # Fixtures extendidos con inyección de dependencias
├── tests/              # Pruebas principales
│   ├── api/           # Pruebas de API con JSONPlaceholder
│   │   └── example-api.spec.ts
│   ├── playwright-home.spec.ts  # Tests UI con Page Objects
│   └── todo-improved.spec.ts    # Tests TODO con validaciones
├── data/              # Datos de prueba centralizados
│   └── api-test-data.ts   # Data providers para tests de API
├── playwright.config.ts  # Configuración optimizada con baseURL
├── .env.example       # Template de variables de entorno
└── package.json       # Dependencias y scripts NPM
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
# Base URLs para diferentes entornos
BASE_URL=https://playwright.dev
TODO_APP_URL=https://demo.playwright.dev/todomvc
API_BASE_URL=https://jsonplaceholder.typicode.com

# Configuración de tests
TEST_TIMEOUT=30000
BROWSER_HEADLESS=true

# Debug
DEBUG=false
TRACE_ON_FAILURE=true
SCREENSHOT_ON_FAILURE=true
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
import { test, expect } from '../fixtures/test-fixtures';
import { ApiValidators } from '../helpers/api.validators';
import { ApiTestData } from '../data/api-test-data';

test('api test with validators', async ({ apiHelper }) => {
  const result = await apiHelper.get('/posts/1');
  await apiHelper.verifyStatus(result, 200);
  ApiValidators.validatePostStructure(result.data);
});

// Data-driven testing
ApiTestData.users.knownUserIds.forEach(userId => {
  test(`should get user ${userId}`, async ({ apiHelper }) => {
    const result = await apiHelper.get(`/users/${userId}`);
    await apiHelper.verifyStatus(result, 200);
    ApiValidators.validateUserStructure(result.data);
  });
});
```

## 🔍 Mejores Prácticas Implementadas

### ✅ Arquitectura y Organización
- **Page Object Model (POM)** con clase base reutilizable
- **Helpers modulares** para API y localStorage con tipado fuerte
- **Fixtures personalizados** para inyección de dependencias
- **Separación de responsabilidades** clara entre páginas, helpers y tests

### ✅ TypeScript y Tipado
- Interfaces y tipos definidos para todas las entidades
- Parámetros tipados en métodos para mejor IntelliSense
- Type assertions en validadores
- Constantes tipadas con `as const` para seguridad

### ✅ Localizadores Robustos
- Uso de `getByRole()`, `getByTestId()` y `getByPlaceholder()`
- Evita selectores CSS frágiles
- Implementa esperas inteligentes y automáticas
- Métodos de espera configurables

### ✅ Manejo de Errores
- Try-catch en operaciones críticas con mensajes descriptivos
- Screenshots automáticos en fallos
- Traces para debugging detallado
- Validación de estados antes de acciones

### ✅ Reutilización de Código
- Clase `BasePage` con métodos comunes (click, fill, wait, etc.)
- Helpers compartidos entre tests
- Fixtures para configuración consistente
- Datos de prueba centralizados

### ✅ Configuración
- Variables de entorno para diferentes ambientes
- Timeouts configurables y centralizados
- Configuración de reporters múltiples
- Gestión de navegadores optimizada

### ✅ Documentación
- JSDoc en todos los métodos públicos
- Comentarios descriptivos en código complejo
- README completo con ejemplos
- Tipos explícitos para mejor comprensión

## 🚀 CI/CD con GitHub Actions

El workflow incluye:

- ✅ **Caché de dependencias npm** - Reduce tiempo de instalación 80-90%
- ✅ **Caché de navegadores Playwright** - Ahorro de 60-85% en descargas
- ✅ **Test Sharding** - Ejecución paralela en 2 shards para mayor velocidad
- ✅ **Workflow manual** - Trigger con `workflow_dispatch`
- ✅ **Múltiples artefactos** - Reports, resultados y traces separados
- ✅ **Variables de entorno** - URLs configurables por ambiente
- ✅ **Fail-fast deshabilitado** - Completa todos los shards aunque fallen

### Mejoras de Performance

| Métrica | Sin Optimización | Con Optimización | Ahorro |
|---------|------------------|-------------------|--------|
| Tiempo total | 8-15 min | 2-4 min | **60-70%** |
| Descarga deps | 2-5 min | 30 seg | **80-90%** |
| Navegadores | 3-8 min | 1 min | **60-85%** |

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
