import { test as base } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/playwright-home.page';
import { TodoPage } from '../pages/todo.page';
import { LocalStorageHelper } from '../helpers/localStorage.helper';
import { ApiHelper } from '../helpers/api.helper';
import { DependencyContainer, createDependencyContainer } from './dependency-container';

/**
 * Extended test fixtures with Dependency Injection pattern
 * 
 * The DependencyContainer manages all test dependencies centrally,
 * providing a clean and maintainable way to access page objects and helpers.
 * 
 * Available fixtures:
 * - dependencyContainer: The central container for all dependencies
 * - playwrightHomePage: Page object for Playwright homepage
 * - todoPage: Page object for Todo application
 * - localStorageHelper: Helper for localStorage operations
 * - apiHelper: Helper for API requests
 */
export const test = base.extend<{
  dependencyContainer: DependencyContainer;
  playwrightHomePage: PlaywrightHomePage;
  todoPage: TodoPage;
  localStorageHelper: LocalStorageHelper;
  apiHelper: ApiHelper;
}>({
  // The central dependency container - initialized once per test
  dependencyContainer: async ({ page, request }, use) => {
    const container = createDependencyContainer();
    container.initializePage(page);
    container.initializeApi(request);
    await use(container);
    // Clear cache after test completes
    container.clearCache();
  },

  // Page object dependencies - retrieved from the container
  playwrightHomePage: async ({ dependencyContainer }, use) => {
    await use(dependencyContainer.playwrightHomePage);
  },

  todoPage: async ({ dependencyContainer }, use) => {
    await use(dependencyContainer.todoPage);
  },

  localStorageHelper: async ({ dependencyContainer }, use) => {
    await use(dependencyContainer.localStorageHelper);
  },

  // API helper - retrieved from the container
  apiHelper: async ({ dependencyContainer }, use) => {
    await use(dependencyContainer.apiHelper);
  }
});

export { expect } from '@playwright/test';

// Common test data
export const TEST_DATA = {
  todos: [
    'buy some cheese',
    'feed the cat',
    'book a doctors appointment'
  ] as const,
  
  users: {
    testUser: {
      email: 'test@example.com',
      password: 'testpass123'
    }
  },
  
  urls: {
    todoApp: 'https://demo.playwright.dev/todomvc',
    playwrightDocs: '/',
    api: {
      users: '/api/users',
      todos: '/api/todos'
    }
  }
};
