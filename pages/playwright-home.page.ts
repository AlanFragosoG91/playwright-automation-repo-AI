import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class PlaywrightHomePage extends BasePage {
  // Locators
  readonly getStartedLink: Locator;
  readonly docsLink: Locator;
  readonly navigationLinks: Locator;
  readonly searchButton: Locator;
  readonly heroTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.navigationLinks = page.locator('nav a');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.heroTitle = page.locator('h1').first();
  }

  // Actions
  async clickGetStarted() {
    await this.safeClick(this.getStartedLink);
  }

  async clickDocs() {
    await this.safeClick(this.docsLink);
  }

  async searchFor(query: string) {
    await this.safeClick(this.searchButton);
    // Add search functionality when search modal opens
  }

  // Assertions helpers
  async verifyPageLoaded() {
    await this.waitForElement(this.heroTitle);
    await this.waitForElement(this.getStartedLink);
  }

  async getNavigationLinks(): Promise<string[]> {
    await this.waitForElement(this.navigationLinks.first());
    return await this.navigationLinks.allTextContents();
  }
}
