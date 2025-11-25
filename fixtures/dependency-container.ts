import { Page, APIRequestContext } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/playwright-home.page';
import { TodoPage } from '../pages/todo.page';
import { LocalStorageHelper } from '../helpers/localStorage.helper';
import { ApiHelper } from '../helpers/api.helper';

/**
 * Interface for all page dependencies that require a Playwright Page instance
 */
interface PageDependencies {
  playwrightHomePage: PlaywrightHomePage;
  todoPage: TodoPage;
  localStorageHelper: LocalStorageHelper;
}

/**
 * Interface for all API dependencies that require an APIRequestContext
 */
interface ApiDependencies {
  apiHelper: ApiHelper;
}

/**
 * Combined interface for all dependencies available in tests
 */
export interface TestDependencies extends PageDependencies, ApiDependencies {}

/**
 * DependencyContainer class that manages all test dependencies.
 * This class follows the Dependency Injection pattern to provide
 * a centralized way of creating and managing page objects and helpers.
 * 
 * Benefits:
 * - Single source of truth for dependency creation
 * - Easy to add new dependencies
 * - Consistent initialization across all tests
 * - Better testability and maintainability
 */
export class DependencyContainer {
  private page: Page | null = null;
  private request: APIRequestContext | null = null;
  private baseURL: string;

  // Cached instances for page dependencies
  private _playwrightHomePage: PlaywrightHomePage | null = null;
  private _todoPage: TodoPage | null = null;
  private _localStorageHelper: LocalStorageHelper | null = null;

  // Cached instance for API dependencies
  private _apiHelper: ApiHelper | null = null;

  constructor(options?: { baseURL?: string }) {
    this.baseURL = options?.baseURL || process.env.BASE_URL || process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
  }

  /**
   * Initialize the container with a Playwright Page instance
   * Call this method to enable page-based dependencies
   */
  initializePage(page: Page): void {
    this.page = page;
    // Clear cached instances when page changes
    this._playwrightHomePage = null;
    this._todoPage = null;
    this._localStorageHelper = null;
  }

  /**
   * Initialize the container with an API request context
   * Call this method to enable API-based dependencies
   */
  initializeApi(request: APIRequestContext): void {
    this.request = request;
    // Clear cached instance when request context changes
    this._apiHelper = null;
  }

  /**
   * Get the PlaywrightHomePage instance
   * Lazily creates and caches the instance
   */
  get playwrightHomePage(): PlaywrightHomePage {
    if (!this.page) {
      throw new Error('Page not initialized. Call initializePage() first.');
    }
    if (!this._playwrightHomePage) {
      this._playwrightHomePage = new PlaywrightHomePage(this.page);
    }
    return this._playwrightHomePage;
  }

  /**
   * Get the TodoPage instance
   * Lazily creates and caches the instance
   */
  get todoPage(): TodoPage {
    if (!this.page) {
      throw new Error('Page not initialized. Call initializePage() first.');
    }
    if (!this._todoPage) {
      this._todoPage = new TodoPage(this.page);
    }
    return this._todoPage;
  }

  /**
   * Get the LocalStorageHelper instance
   * Lazily creates and caches the instance
   */
  get localStorageHelper(): LocalStorageHelper {
    if (!this.page) {
      throw new Error('Page not initialized. Call initializePage() first.');
    }
    if (!this._localStorageHelper) {
      this._localStorageHelper = new LocalStorageHelper(this.page);
    }
    return this._localStorageHelper;
  }

  /**
   * Get the ApiHelper instance
   * Lazily creates and caches the instance
   */
  get apiHelper(): ApiHelper {
    if (!this.request) {
      throw new Error('API request context not initialized. Call initializeApi() first.');
    }
    if (!this._apiHelper) {
      this._apiHelper = new ApiHelper(this.request, this.baseURL);
    }
    return this._apiHelper;
  }

  /**
   * Create a new instance of PlaywrightHomePage (non-cached)
   * Use this if you need a fresh instance
   */
  createPlaywrightHomePage(): PlaywrightHomePage {
    if (!this.page) {
      throw new Error('Page not initialized. Call initializePage() first.');
    }
    return new PlaywrightHomePage(this.page);
  }

  /**
   * Create a new instance of TodoPage (non-cached)
   * Use this if you need a fresh instance
   */
  createTodoPage(): TodoPage {
    if (!this.page) {
      throw new Error('Page not initialized. Call initializePage() first.');
    }
    return new TodoPage(this.page);
  }

  /**
   * Create a new instance of LocalStorageHelper (non-cached)
   * Use this if you need a fresh instance
   */
  createLocalStorageHelper(): LocalStorageHelper {
    if (!this.page) {
      throw new Error('Page not initialized. Call initializePage() first.');
    }
    return new LocalStorageHelper(this.page);
  }

  /**
   * Create a new instance of ApiHelper (non-cached)
   * Use this if you need a fresh instance
   */
  createApiHelper(customBaseURL?: string): ApiHelper {
    if (!this.request) {
      throw new Error('API request context not initialized. Call initializeApi() first.');
    }
    return new ApiHelper(this.request, customBaseURL || this.baseURL);
  }

  /**
   * Clear all cached instances
   * Useful for resetting state between tests if needed
   */
  clearCache(): void {
    this._playwrightHomePage = null;
    this._todoPage = null;
    this._localStorageHelper = null;
    this._apiHelper = null;
  }

  /**
   * Get all page dependencies at once
   * Useful when you need multiple dependencies in a test
   */
  getPageDependencies(): PageDependencies {
    return {
      playwrightHomePage: this.playwrightHomePage,
      todoPage: this.todoPage,
      localStorageHelper: this.localStorageHelper
    };
  }

  /**
   * Get all API dependencies at once
   */
  getApiDependencies(): ApiDependencies {
    return {
      apiHelper: this.apiHelper
    };
  }

  /**
   * Get all dependencies at once
   * Note: Requires both page and request to be initialized
   */
  getAllDependencies(): TestDependencies {
    return {
      ...this.getPageDependencies(),
      ...this.getApiDependencies()
    };
  }
}

/**
 * Factory function to create a pre-configured DependencyContainer
 */
export function createDependencyContainer(options?: { baseURL?: string }): DependencyContainer {
  return new DependencyContainer(options);
}
