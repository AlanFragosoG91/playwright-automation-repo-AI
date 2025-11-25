import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export type FilterType = 'all' | 'active' | 'completed';

/**
 * Page Object for Todo MVC application
 * Implements methods for interacting with todo items and filters
 */
export class TodoPage extends BasePage {
  // Locators
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoTitles: Locator;
  readonly todoCount: Locator;
  readonly toggleAllCheckbox: Locator;
  readonly clearCompletedButton: Locator;
  readonly filterLinks: {
    all: Locator;
    active: Locator;
    completed: Locator;
  };

  constructor(page: Page) {
    super(page);
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoTitles = page.getByTestId('todo-title');
    this.todoCount = page.getByTestId('todo-count');
    this.toggleAllCheckbox = page.getByLabel('Mark all as complete');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.filterLinks = {
      all: page.getByRole('link', { name: 'All' }),
      active: page.getByRole('link', { name: 'Active' }),
      completed: page.getByRole('link', { name: 'Completed' })
    };
  }

  // Actions
  
  /**
   * Add a single todo item
   * @param text - Todo text to add
   */
  async addTodo(text: string): Promise<void> {
    await this.safeFill(this.newTodoInput, text);
    await this.newTodoInput.press('Enter');
    await this.page.waitForTimeout(100); // Small wait for state update
  }

  /**
   * Add multiple todo items
   * @param todos - Array of todo texts to add
   */
  async addMultipleTodos(todos: string[]): Promise<void> {
    for (const todo of todos) {
      await this.addTodo(todo);
    }
  }

  /**
   * Toggle (check/uncheck) a todo by index
   * @param index - Zero-based index of the todo
   */
  async toggleTodo(index: number): Promise<void> {
    const checkbox = this.todoItems.nth(index).getByRole('checkbox');
    await checkbox.check();
  }

  /**
   * Uncheck a completed todo
   * @param index - Zero-based index of the todo
   */
  async uncheckTodo(index: number): Promise<void> {
    const checkbox = this.todoItems.nth(index).getByRole('checkbox');
    await checkbox.uncheck();
  }

  /**
   * Delete a todo by index
   * @param index - Zero-based index of the todo
   */
  async deleteTodo(index: number): Promise<void> {
    const todoItem = this.todoItems.nth(index);
    await todoItem.hover();
    await todoItem.getByRole('button', { name: 'Delete' }).click();
  }

  /**
   * Edit a todo item
   * @param index - Zero-based index of the todo
   * @param newText - New text for the todo
   */
  async editTodo(index: number, newText: string): Promise<void> {
    const todoItem = this.todoItems.nth(index);
    await todoItem.dblclick();
    
    const editInput = todoItem.getByRole('textbox', { name: 'Edit' });
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  /**
   * Cancel editing a todo
   * @param index - Zero-based index of the todo
   */
  async cancelEditTodo(index: number): Promise<void> {
    const todoItem = this.todoItems.nth(index);
    await todoItem.dblclick();
    
    const editInput = todoItem.getByRole('textbox', { name: 'Edit' });
    await editInput.press('Escape');
  }

  /**
   * Toggle all todos (mark all as complete or incomplete)
   */
  async toggleAllTodos(): Promise<void> {
    await this.safeClick(this.toggleAllCheckbox);
  }

  /**
   * Clear all completed todos
   */
  async clearCompleted(): Promise<void> {
    await this.safeClick(this.clearCompletedButton);
  }

  /**
   * Filter todos by status
   * @param filter - Filter type: 'all', 'active', or 'completed'
   */
  async filterBy(filter: FilterType): Promise<void> {
    await this.safeClick(this.filterLinks[filter]);
    await this.page.waitForTimeout(100); // Small wait for filter to apply
  }

  // Getters
  
  /**
   * Get total count of visible todos
   * @returns Number of todos
   */
  async getTodoCount(): Promise<number> {
    return await this.todoItems.count();
  }

  /**
   * Get text content of all visible todos
   * @returns Array of todo texts
   */
  async getTodoTexts(): Promise<string[]> {
    return await this.todoTitles.allTextContents();
  }

  /**
   * Get text of a specific todo by index
   * @param index - Zero-based index
   * @returns Todo text
   */
  async getTodoText(index: number): Promise<string> {
    return await this.getText(this.todoTitles.nth(index));
  }

  /**
   * Get count of completed todos
   * @returns Number of completed todos
   */
  async getCompletedCount(): Promise<number> {
    const completed = this.page.locator('.todo-list li.completed');
    return await completed.count();
  }

  /**
   * Get count of active (not completed) todos
   * @returns Number of active todos
   */
  async getActiveCount(): Promise<number> {
    const total = await this.getTodoCount();
    const completed = await this.getCompletedCount();
    return total - completed;
  }

  /**
   * Check if a todo is completed
   * @param index - Zero-based index
   * @returns True if todo is completed
   */
  async isTodoCompleted(index: number): Promise<boolean> {
    const todoItem = this.todoItems.nth(index);
    const classes = await todoItem.getAttribute('class') || '';
    return classes.includes('completed');
  }

  /**
   * Check if clear completed button is visible
   * @returns True if button is visible
   */
  async isClearCompletedVisible(): Promise<boolean> {
    return await this.isVisible(this.clearCompletedButton);
  }

  // Verification helpers
  
  /**
   * Verify a todo exists by text
   * @param text - Todo text to search for
   */
  async verifyTodoExists(text: string): Promise<void> {
    await this.waitForElement(this.todoTitles.filter({ hasText: text }));
  }

  /**
   * Verify todo count matches expected value
   * @param expected - Expected count
   */
  async verifyTodoCount(expected: number): Promise<void> {
    await this.waitForElement(this.todoCount);
    const count = await this.getTodoCount();
    if (count !== expected) {
      throw new Error(`Expected ${expected} todos but found ${count}`);
    }
  }

  /**
   * Verify page is loaded and ready
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement(this.newTodoInput);
  }
}
