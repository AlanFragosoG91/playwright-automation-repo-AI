import { test, expect, TEST_DATA } from '../fixtures/test-fixtures';

test.describe('Todo App - Complete Test Suite', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.goto(TEST_DATA.urls.todoApp);
    await todoPage.waitForPageLoad();
  });

  test.describe('Adding Todos', () => {
    test('should add single todo item', async ({ todoPage, localStorageHelper }) => {
      await todoPage.addTodo(TEST_DATA.todos[0]);
      
      // Verify UI
      await expect(todoPage.todoTitles).toHaveText([TEST_DATA.todos[0]]);
      
      // Verify localStorage
      await localStorageHelper.waitForTodoCount(1);
      await localStorageHelper.waitForTodoTitle(TEST_DATA.todos[0]);
    });

    test('should add multiple todo items', async ({ todoPage, localStorageHelper }) => {
      await todoPage.addMultipleTodos([...TEST_DATA.todos]);
      
      // Verify all todos are displayed
      await expect(todoPage.todoTitles).toHaveText([...TEST_DATA.todos]);
      
      // Verify localStorage count
      await localStorageHelper.waitForTodoCount(3);
    });

    test('should clear input field after adding todo', async ({ todoPage }) => {
      await todoPage.addTodo(TEST_DATA.todos[0]);
      
      // Verify input is empty
      await expect(todoPage.newTodoInput).toBeEmpty();
    });
  });

  test.describe('Managing Todos', () => {
    test.beforeEach(async ({ todoPage }) => {
      await todoPage.addMultipleTodos([...TEST_DATA.todos]);
    });

    test('should mark todo as completed', async ({ todoPage, localStorageHelper }) => {
      await todoPage.toggleTodo(0);
      
      // Verify UI state
      const firstTodo = todoPage.todoItems.nth(0);
      await expect(firstTodo).toHaveClass(/completed/);
      
      // Verify localStorage
      await localStorageHelper.waitForCompletedTodoCount(1);
    });

    test('should edit todo item', async ({ todoPage, localStorageHelper }) => {
      const newText = 'buy some sausages';
      await todoPage.editTodo(1, newText);
      
      // Verify edited todo
      await expect(todoPage.todoTitles).toHaveText([
        TEST_DATA.todos[0],
        newText,
        TEST_DATA.todos[2]
      ]);
      
      // Verify localStorage
      await localStorageHelper.waitForTodoTitle(newText);
    });

    test('should toggle all todos', async ({ todoPage, localStorageHelper }) => {
      await todoPage.toggleAllTodos();
      
      // Verify all todos are completed
      await expect(todoPage.todoItems).toHaveClass([
        /completed/, /completed/, /completed/
      ]);
      
      // Verify localStorage
      await localStorageHelper.waitForCompletedTodoCount(3);
    });
  });

  test.describe('Filtering Todos', () => {
    test.beforeEach(async ({ todoPage }) => {
      await todoPage.addMultipleTodos([...TEST_DATA.todos]);
      await todoPage.toggleTodo(1); // Mark second todo as completed
    });

    test('should filter active todos', async ({ todoPage }) => {
      await todoPage.filterBy('active');
      
      // Should show only uncompleted todos
      await expect(todoPage.todoItems).toHaveCount(2);
      await expect(todoPage.todoTitles).toHaveText([
        TEST_DATA.todos[0],
        TEST_DATA.todos[2]
      ]);
    });

    test('should filter completed todos', async ({ todoPage }) => {
      await todoPage.filterBy('completed');
      
      // Should show only completed todos
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoTitles).toHaveText([TEST_DATA.todos[1]]);
    });

    test('should show all todos', async ({ todoPage }) => {
      await todoPage.filterBy('completed');
      await todoPage.filterBy('all');
      
      // Should show all todos
      await expect(todoPage.todoItems).toHaveCount(3);
    });
  });

  test.describe('Persistence', () => {
    test('should persist todos after page reload', async ({ 
      todoPage, 
      localStorageHelper,
      page 
    }) => {
      // Add todos and mark one as completed
      await todoPage.addMultipleTodos(TEST_DATA.todos.slice(0, 2));
      await todoPage.toggleTodo(0);
      
      // Verify initial state
      await localStorageHelper.waitForTodoCount(2);
      await localStorageHelper.waitForCompletedTodoCount(1);
      
      // Reload page
      await page.reload();
      await todoPage.waitForPageLoad();
      
      // Verify persistence
      await expect(todoPage.todoItems).toHaveCount(2);
      const firstTodo = todoPage.todoItems.nth(0);
      await expect(firstTodo).toHaveClass(/completed/);
    });
  });
});
