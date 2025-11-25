import { Page, Locator } from '@playwright/test';

// Constants for timeouts
export const TIMEOUTS = {
  DEFAULT: 5000,
  LONG: 10000,
  SHORT: 2000,
  PAGE_LOAD: 30000,
} as const;

// Page options interface
export interface PageOptions {
  timeout?: number;
  waitForLoadState?: 'load' | 'domcontentloaded' | 'networkidle';
}

/**
 * Base class for all Page Objects
 * Provides common functionality and helper methods
 */
export abstract class BasePage {
  readonly page: Page;
  protected readonly defaultTimeout: number = TIMEOUTS.DEFAULT;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   * @param path - The path to navigate to (will be appended to baseURL)
   * @param options - Navigation options
   */
  async goto(path: string = '', options?: PageOptions) {
    try {
      await this.page.goto(path, {
        waitUntil: options?.waitForLoadState || 'domcontentloaded',
        timeout: options?.timeout || TIMEOUTS.PAGE_LOAD,
      });
    } catch (error) {
      throw new Error(`Failed to navigate to ${path}: ${error}`);
    }
  }

  /**
   * Wait for page to be loaded
   * @param state - Load state to wait for
   */
  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle') {
    await this.page.waitForLoadState(state);
  }

  /**
   * Wait for element to be visible with retry
   * @param locator - The element locator
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = this.defaultTimeout) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      throw new Error(`Element not visible within ${timeout}ms: ${error}`);
    }
  }

  /**
   * Wait for element to be hidden
   * @param locator - The element locator
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForElementHidden(locator: Locator, timeout: number = this.defaultTimeout) {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Safe click with wait
   * @param locator - The element to click
   * @param options - Click options
   */
  async safeClick(locator: Locator, options?: { force?: boolean; timeout?: number }) {
    await this.waitForElement(locator, options?.timeout);
    await locator.click({ force: options?.force });
  }

  /**
   * Safe fill with clear
   * @param locator - The input element
   * @param text - Text to fill
   */
  async safeFill(locator: Locator, text: string) {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Check if element is visible
   * @param locator - The element locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text content
   * @param locator - The element locator
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) || '';
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take screenshot for debugging
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string) {
    const timestamp = Date.now();
    const path = `test-results/${name}-${timestamp}.png`;
    await this.page.screenshot({ path, fullPage: true });
    return path;
  }

  /**
   * Scroll element into view
   * @param locator - The element to scroll to
   */
  async scrollIntoView(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for network idle (useful after actions that trigger network requests)
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Reload the current page
   */
  async reload() {
    await this.page.reload({ waitUntil: 'networkidle' });
  }
}
