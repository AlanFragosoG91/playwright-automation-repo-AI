import { Page } from '@playwright/test';

export class LocalStorageHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for localStorage to have expected number of todos
   */
  async waitForTodoCount(expected: number): Promise<void> {
    await this.page.waitForFunction(
      (expectedCount) => {
        const todos = JSON.parse(localStorage['react-todos'] || '[]');
        return todos.length === expectedCount;
      },
      expected,
      { timeout: 5000 }
    );
  }

  /**
   * Wait for localStorage to have expected number of completed todos
   */
  async waitForCompletedTodoCount(expected: number): Promise<void> {
    await this.page.waitForFunction(
      (expectedCount) => {
        const todos = JSON.parse(localStorage['react-todos'] || '[]');
        return todos.filter((todo: any) => todo.completed).length === expectedCount;
      },
      expected,
      { timeout: 5000 }
    );
  }

  /**
   * Check if todo with specific title exists in localStorage
   */
  async waitForTodoTitle(title: string): Promise<void> {
    await this.page.waitForFunction(
      (expectedTitle) => {
        const todos = JSON.parse(localStorage['react-todos'] || '[]');
        return todos.some((todo: any) => todo.title === expectedTitle);
      },
      title,
      { timeout: 5000 }
    );
  }

  /**
   * Get all todos from localStorage
   */
  async getAllTodos(): Promise<any[]> {
    return await this.page.evaluate(() => {
      return JSON.parse(localStorage['react-todos'] || '[]');
    });
  }

  /**
   * Clear all todos from localStorage
   */
  async clearAllTodos(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage['react-todos'] = '[]';
    });
  }

  /**
   * Set specific todos in localStorage
   */
  async setTodos(todos: any[]): Promise<void> {
    await this.page.evaluate((todosData) => {
      localStorage['react-todos'] = JSON.stringify(todosData);
    }, todos);
  }
}
