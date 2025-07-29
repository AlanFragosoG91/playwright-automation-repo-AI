import { test, expect } from '../fixtures/test-fixtures';

test.describe('Playwright Homepage Tests', () => {
  test.beforeEach(async ({ playwrightHomePage }) => {
    await playwrightHomePage.goto('/');
    await playwrightHomePage.verifyPageLoaded();
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should navigate to installation page via get started link', async ({ 
    playwrightHomePage, 
    page 
  }) => {
    await playwrightHomePage.clickGetStarted();
    
    // Verify navigation
    await expect(
      page.getByRole('heading', { name: 'Installation' })
    ).toBeVisible();
  });

  test('should have proper navigation structure', async ({ playwrightHomePage }) => {
    const navLinks = await playwrightHomePage.getNavigationLinks();
    
    // Verify expected navigation items exist
    expect(navLinks.length).toBeGreaterThan(0);
    // Add more specific assertions based on your needs
  });
});
