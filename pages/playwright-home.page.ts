import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page Object for Playwright documentation homepage
 * Provides methods for navigating and interacting with the Playwright site
 */
export class PlaywrightHomePage extends BasePage {
  // Locators
  readonly getStartedLink: Locator;
  readonly docsLink: Locator;
  readonly navigationLinks: Locator;
  readonly searchButton: Locator;
  readonly heroTitle: Locator;
  readonly communityLink: Locator;
  readonly apiLink: Locator;

  constructor(page: Page) {
    super(page);
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.navigationLinks = page.locator('nav a');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.heroTitle = page.locator('h1').first();
    this.communityLink = page.getByRole('link', { name: 'Community' });
    this.apiLink = page.getByRole('link', { name: 'API' });
  }

  // Navigation Actions
  
  /**
   * Click the "Get Started" link
   */
  async clickGetStarted(): Promise<void> {
    await this.safeClick(this.getStartedLink);
    await this.waitForPageLoad();
  }

  /**
   * Click the "Docs" link
   */
  async clickDocs(): Promise<void> {
    await this.safeClick(this.docsLink);
    await this.waitForPageLoad();
  }

  /**
   * Click the "Community" link
   */
  async clickCommunity(): Promise<void> {
    await this.safeClick(this.communityLink);
    await this.waitForPageLoad();
  }

  /**
   * Click the "API" link
   */
  async clickApi(): Promise<void> {
    await this.safeClick(this.apiLink);
    await this.waitForPageLoad();
  }

  /**
   * Open search modal
   */
  async openSearch(): Promise<void> {
    await this.safeClick(this.searchButton);
  }

  /**
   * Search for a query (if search modal is implemented)
   * @param query - Search query string
   */
  async searchFor(query: string): Promise<void> {
    await this.openSearch();
    // Wait for search modal to open
    await this.page.waitForTimeout(500);
    
    // Type in search box if available
    const searchInput = this.page.locator('input[type="search"]').first();
    if (await this.isVisible(searchInput)) {
      await searchInput.fill(query);
      await searchInput.press('Enter');
    }
  }

  // Getters
  
  /**
   * Get all navigation link texts
   * @returns Array of navigation link texts
   */
  async getNavigationLinks(): Promise<string[]> {
    await this.waitForElement(this.navigationLinks.first());
    return await this.navigationLinks.allTextContents();
  }

  /**
   * Get the hero title text
   * @returns Hero title text
   */
  async getHeroTitle(): Promise<string> {
    return await this.getText(this.heroTitle);
  }

  /**
   * Check if search button is visible
   * @returns True if search button is visible
   */
  async isSearchVisible(): Promise<boolean> {
    return await this.isVisible(this.searchButton);
  }

  // Verification Helpers
  
  /**
   * Verify the homepage is loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement(this.heroTitle);
    await this.waitForElement(this.getStartedLink);
    await this.waitForNetworkIdle();
  }

  /**
   * Verify navigation is present
   */
  async verifyNavigationPresent(): Promise<void> {
    await this.waitForElement(this.navigationLinks.first());
    const count = await this.navigationLinks.count();
    
    if (count === 0) {
      throw new Error('Navigation links not found');
    }
  }

  /**
   * Verify specific navigation link exists
   * @param linkText - Text of the navigation link
   */
  async verifyNavigationLinkExists(linkText: string): Promise<void> {
    const link = this.page.getByRole('link', { name: linkText });
    await this.waitForElement(link);
  }
}
