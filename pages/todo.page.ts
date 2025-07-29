import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

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
  async addTodo(text: string) {
    await this.safeFill(this.newTodoInput, text);
    await this.newTodoInput.press('Enter');
  }

  async addMultipleTodos(todos: string[]) {
    for (const todo of todos) {
      await this.addTodo(todo);
    }
  }

  async toggleTodo(index: number) {
    await this.todoItems.nth(index).getByRole('checkbox').check();
  }

  async editTodo(index: number, newText: string) {
    const todoItem = this.todoItems.nth(index);
    await todoItem.dblclick();
    const editInput = todoItem.getByRole('textbox', { name: 'Edit' });
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  async toggleAllTodos() {
    await this.safeClick(this.toggleAllCheckbox);
  }

  async clearCompleted() {
    await this.safeClick(this.clearCompletedButton);
  }

  async filterBy(filter: 'all' | 'active' | 'completed') {
    await this.safeClick(this.filterLinks[filter]);
  }

  // Getters
  async getTodoCount(): Promise<number> {
    return await this.todoItems.count();
  }

  async getTodoTexts(): Promise<string[]> {
    return await this.todoTitles.allTextContents();
  }

  async getCompletedCount(): Promise<number> {
    const completed = this.todoItems.filter({ hasText: /completed/ });
    return await completed.count();
  }

  // Verification helpers
  async verifyTodoExists(text: string) {
    await this.waitForElement(this.todoTitles.filter({ hasText: text }));
  }

  async verifyTodoCount(expected: number) {
    await this.waitForElement(this.todoCount);
    // Additional verification can be added here
  }
}
