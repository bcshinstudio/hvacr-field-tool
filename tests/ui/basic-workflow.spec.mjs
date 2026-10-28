import { test, expect } from '@playwright/test';

const supportedSystems = [
  ['walk_in_cooler', /Walk-In Cooler/i],
  ['walk_in_freezer', /Walk-In Freezer/i],
  ['ac_split', /Residential Split AC/i],
  ['ac_package', /Residential Package/i],
  ['reach_in_refrigerator', /Reach-In Refrigerator/i],
  ['reach_in_freezer', /Reach-In Freezer/i],
];

test('app loads with usable tools and no uncaught JavaScript errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('/');
  await expect(page.locator('#system-select')).toBeVisible();
  await expect(page.locator('#system-title')).toContainText('Walk-In Cooler');
  await expect(page.locator('[data-tool="calculations"]')).toBeVisible();
  await page.locator('[data-tool="calculations"]').click();
  await expect(page.getByText('Saturation Temperature').first()).toBeVisible();
  await page.locator('[data-tool="system_check"]').click();
  await expect(page.getByText('Diagnostic Context')).toBeVisible();
  expect(errors).toEqual([]);
});

for (const [system, title] of supportedSystems) {
  test(`system selection loads ${system} without runtime errors`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('/');
    await page.locator('#system-select').selectOption(system);
    await expect(page.locator('#system-title')).toContainText(title);
    await page.locator('[data-tool="calculations"]').click();
    await expect(page.getByText('Refrigerant', { exact: true }).first()).toBeVisible();
    await page.locator('[data-tool="system_check"]').click();
    await expect(page.getByText('Diagnostic Context')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('System Check can be opened in Unknown state without a forced diagnosis', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-tool="system_check"]').click();
  await expect(page.getByText('Operating State', { exact: true })).toBeVisible();
  await expect(page.getByText('Evaporator / Suction Pressure Reading')).toBeVisible();
});
