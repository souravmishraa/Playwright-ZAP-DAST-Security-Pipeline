import { test, expect } from '@playwright/test';

const validEmail = 'admin@juice-sh.op';
const validPassword = 'admin123';
const invalidPassword = 'wrong-password';

async function openLogin(page) {
  await page.goto('/#/login');
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(/.*#\/login/);

  const dismissWelcome = page.locator('button[aria-label="Close Welcome Banner"]');
  try {
    await dismissWelcome.waitFor({ state: 'visible', timeout: 3000 });
    await dismissWelcome.click();
  } catch {
    // Welcome banner not displayed
  }

  const dismissCookie = page.locator('a[aria-label="dismiss cookie message"]');
  try {
    await dismissCookie.waitFor({ state: 'visible', timeout: 3000 });
    await dismissCookie.click();
  } catch {
    // Cookie banner not displayed
  }

  await page.locator('#email').waitFor({ state: 'visible' });
}

test.describe('Juice Shop login', () => {
  test('allows a user with valid credentials to sign in', async ({ page }) => {
    await openLogin(page);

    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    const loginBtn = page.locator('#loginButton');

    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(validEmail);

    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(validPassword);

    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();
await page.waitForTimeout(3000);
console.log(await page.url());
    await expect(page).not.toHaveURL(/.*#\/login/);
    
    const accountMenu = page.locator('#navbarAccount');
    await accountMenu.waitFor({ state: 'visible' });
    await accountMenu.click();

    const logoutBtn = page.locator('#navbarLogoutButton');
    await expect(logoutBtn).toBeVisible({ timeout: 10000 });
  });

  test('shows an error message for invalid credentials', async ({ page }) => {
    await openLogin(page);

    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    const loginBtn = page.locator('#loginButton');

    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(validEmail);

    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(invalidPassword);

    await expect(loginBtn).toBeEnabled();
    await loginBtn.click();

    const errorMsg = page.locator('text=Invalid email or password');
    await expect(errorMsg).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/.*#\/login/);
  });
});
