import { Page } from '@playwright/test';

// Storage configuration
const STORAGE_CONFIG = {
  TODO_KEY: 'react-todos',
  DEFAULT_TIMEOUT: 5000,
} as const;

// Type definitions
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
}

/**
 * Helper class for interacting with browser localStorage
 * Provides type-safe methods for todo app storage operations
 */
export class LocalStorageHelper {
  private readonly page: Page;
  private readonly storageKey: string;
  private readonly timeout: number;

  constructor(page: Page, storageKey: string = STORAGE_CONFIG.TODO_KEY, timeout: number = STORAGE_CONFIG.DEFAULT_TIMEOUT) {
    this.page = page;
    this.storageKey = storageKey;
    this.timeout = timeout;
  }

  /**
   * Wait for localStorage to have expected number of todos
   * @param expected - Expected number of todos
   */
  async waitForTodoCount(expected: number): Promise<void> {
    await this.page.waitForFunction(
      ({ key, expectedCount }) => {
        const todos = JSON.parse(localStorage[key] || '[]');
        return todos.length === expectedCount;
      },
      { key: this.storageKey, expectedCount: expected },
      { timeout: this.timeout }
    );
  }

  /**
   * Wait for localStorage to have expected number of completed todos
   * @param expected - Expected number of completed todos
   */
  async waitForCompletedTodoCount(expected: number): Promise<void> {
    await this.page.waitForFunction(
      ({ key, expectedCount }) => {
        const todos = JSON.parse(localStorage[key] || '[]');
        return todos.filter((todo: Todo) => todo.completed).length === expectedCount;
      },
      { key: this.storageKey, expectedCount: expected },
      { timeout: this.timeout }
    );
  }

  /**
   * Wait for localStorage to have expected number of active (not completed) todos
   * @param expected - Expected number of active todos
   */
  async waitForActiveTodoCount(expected: number): Promise<void> {
    await this.page.waitForFunction(
      ({ key, expectedCount }) => {
        const todos = JSON.parse(localStorage[key] || '[]');
        return todos.filter((todo: Todo) => !todo.completed).length === expectedCount;
      },
      { key: this.storageKey, expectedCount: expected },
      { timeout: this.timeout }
    );
  }

  /**
   * Check if todo with specific title exists in localStorage
   * @param title - Todo title to search for
   */
  async waitForTodoTitle(title: string): Promise<void> {
    await this.page.waitForFunction(
      ({ key, expectedTitle }) => {
        const todos = JSON.parse(localStorage[key] || '[]');
        return todos.some((todo: Todo) => todo.title === expectedTitle);
      },
      { key: this.storageKey, expectedTitle: title },
      { timeout: this.timeout }
    );
  }

  /**
   * Get all todos from localStorage
   * @returns Array of todos
   */
  async getAllTodos(): Promise<Todo[]> {
    return await this.page.evaluate((key) => {
      return JSON.parse(localStorage[key] || '[]');
    }, this.storageKey);
  }

  /**
   * Get completed todos from localStorage
   * @returns Array of completed todos
   */
  async getCompletedTodos(): Promise<Todo[]> {
    return await this.page.evaluate((key) => {
      const todos = JSON.parse(localStorage[key] || '[]');
      return todos.filter((todo: Todo) => todo.completed);
    }, this.storageKey);
  }

  /**
   * Get active (not completed) todos from localStorage
   * @returns Array of active todos
   */
  async getActiveTodos(): Promise<Todo[]> {
    return await this.page.evaluate((key) => {
      const todos = JSON.parse(localStorage[key] || '[]');
      return todos.filter((todo: Todo) => !todo.completed);
    }, this.storageKey);
  }

  /**
   * Clear all todos from localStorage
   */
  async clearAllTodos(): Promise<void> {
    await this.page.evaluate((key) => {
      localStorage[key] = '[]';
    }, this.storageKey);
  }

  /**
   * Set specific todos in localStorage
   * @param todos - Array of todos to set
   */
  async setTodos(todos: Todo[]): Promise<void> {
    await this.page.evaluate(({ key, todosData }) => {
      localStorage[key] = JSON.stringify(todosData);
    }, { key: this.storageKey, todosData: todos });
  }

  /**
   * Get todo count from localStorage
   * @returns Number of todos
   */
  async getTodoCount(): Promise<number> {
    return await this.page.evaluate((key) => {
      const todos = JSON.parse(localStorage[key] || '[]');
      return todos.length;
    }, this.storageKey);
  }

  /**
   * Check if localStorage is empty
   * @returns True if no todos exist
   */
  async isEmpty(): Promise<boolean> {
    const count = await this.getTodoCount();
    return count === 0;
  }

  /**
   * Add a single todo to localStorage
   * @param todo - Todo to add
   */
  async addTodo(todo: Todo): Promise<void> {
    await this.page.evaluate(({ key, todoData }) => {
      const todos = JSON.parse(localStorage[key] || '[]');
      todos.push(todoData);
      localStorage[key] = JSON.stringify(todos);
    }, { key: this.storageKey, todoData: todo });
  }
}
