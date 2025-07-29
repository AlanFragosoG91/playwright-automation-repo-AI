import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   * @param path - The path to navigate to (will be appended to baseURL)
   */
  async goto(path: string = '') {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible with retry
   */
  async waitForElement(locator: Locator, timeout: number = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Safe click with wait
   */
  async safeClick(locator: Locator) {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Safe fill with clear
   */
  async safeFill(locator: Locator, text: string) {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}
