import { test as base } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/playwright-home.page';
import { TodoPage } from '../pages/todo.page';
import { LocalStorageHelper } from '../helpers/localStorage.helper';
import { ApiHelper } from '../helpers/api.helper';
import { DependencyContainer, createDependencyContainer } from './dependency-container';

// Environment configuration
const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://playwright.dev',
  API_BASE_URL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  TODO_APP_URL: process.env.TODO_APP_URL || 'https://demo.playwright.dev/todomvc',
} as const;

/**
 * Extended test fixtures with Dependency Injection pattern
 */
export const test = base.extend<{
  dependencyContainer: DependencyContainer;
  playwrightHomePage: PlaywrightHomePage;
  todoPage: TodoPage;
  localStorageHelper: LocalStorageHelper;
  apiHelper: ApiHelper;
}>({
  dependencyContainer: async ({ page, request }, use) => {
    const container = createDependencyContainer();
    container.initializePage(page);
    container.initializeApi(request);
    await use(container);
    container.clearCache();
  },

  playwrightHomePage: async ({ dependencyContainer }, use) => {
    await use(dependencyContainer.playwrightHomePage);
  },

  todoPage: async ({ dependencyContainer }, use) => {
    await use(dependencyContainer.todoPage);
  },

  localStorageHelper: async ({ dependencyContainer }, use) => {
    await use(dependencyContainer.localStorageHelper);
  },

  apiHelper: async ({ dependencyContainer }, use) => {
    await use(dependencyContainer.apiHelper);
  }
});

export { expect } from '@playwright/test';
export { ENV };

export const TEST_DATA = {
  todos: ['buy some cheese', 'feed the cat', 'book a doctors appointment'] as const,
  users: {
    testUser: { email: 'test@example.com', password: 'testpass123', name: 'Test User' },
    adminUser: { email: 'admin@example.com', password: 'adminpass123', name: 'Admin User' }
  },
  urls: {
    todoApp: ENV.TODO_APP_URL,
    playwrightDocs: ENV.BASE_URL,
    api: { users: '/users', todos: '/todos', posts: '/posts', comments: '/comments' }
  },
  api: {
    samplePost: { title: 'Test Post', body: 'This is a test post body', userId: 1 },
    sampleUser: { name: 'Test User', email: 'testuser@example.com', phone: '123-456-7890' }
  }
} as const;

export const TIMEOUTS = { SHORT: 2000, DEFAULT: 5000, LONG: 10000, PAGE_LOAD: 30000 } as const;
export const generateTestId = (): string => 	est_${Date.now()}_${Math.random().toString(36).substr(2, 9)};
export const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
