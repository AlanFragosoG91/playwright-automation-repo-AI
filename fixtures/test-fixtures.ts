import { test as base } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/playwright-home.page';
import { TodoPage } from '../pages/todo.page';
import { LocalStorageHelper } from '../helpers/localStorage.helper';
import { ApiHelper } from '../helpers/api.helper';

// Extend the base test with our page objects and helpers
export const test = base.extend<{
  playwrightHomePage: PlaywrightHomePage;
  todoPage: TodoPage;
  localStorageHelper: LocalStorageHelper;
  apiHelper: ApiHelper;
}>({
  playwrightHomePage: async ({ page }, use) => {
    const playwrightHomePage = new PlaywrightHomePage(page);
    await use(playwrightHomePage);
  },

  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await use(todoPage);
  },

  localStorageHelper: async ({ page }, use) => {
    const localStorageHelper = new LocalStorageHelper(page);
    await use(localStorageHelper);
  },

  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request, process.env.API_BASE_URL || '');
    await use(apiHelper);
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
