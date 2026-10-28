import { test, expect } from '@playwright/test';

// Tests interact with the actual browser DOM and do not stub the Brain.
// They guard behavior that generated-HTML unit tests cannot establish.
const systems = [
  'walk_in_cooler', 'walk_in_freezer', 'reach_in_refrigerator',
  'reach_in_freezer', 'ac_split', 'ac_package',
];
const sections = [
  'Why this diagnosis?', 'Other possible causes', 'Confirmation tests',
  'Repair guidance', 'Evidence used',
];

async function openCheck(page, system) {
  await page.goto('/');
  await page.locator('#system-select').selectOption(system);
  await page.locator('[data-tool="system_check"]').click();
  await expect(page.locator('[data-wic-context="operatingState"]')).toBeVisible();
}

for (const system of systems) {
  test(`${system}: diagnostic explanation sections open and show applicable guidance`, async ({page}) => {
    const errors=[];
    page.on('pageerror', error => errors.push(error.message));
    await openCheck(page, system);
    for (const label of sections) {
      const details = page.locator('details').filter({has: page.locator('summary', {hasText: label})}).last();
      await expect(details).toBeVisible();
      await details.locator('summary').click();
      await expect(details).toHaveAttribute('open', '');
      const contents = (await details.innerText()).replace(label, '').trim();
      // The empty initial session has no measured evidence. Alternative causes may
      // legitimately be absent; do not require the Brain to invent candidates.
      // Every other section must still display usable guidance.
      if (label !== 'Other possible causes') {
        expect(contents.length, `${system}: ${label} is empty`).toBeGreaterThan(10);
      }
    }
    expect(errors).toEqual([]);
  });
}

for (const system of systems) {
  test(`${system}: Unknown, Stable cooling and Unknown again render safely`, async ({page}) => {
    const errors=[];
    page.on('pageerror', error => errors.push(error.message));
    await openCheck(page, system);
    const state=page.locator('[data-wic-context="operatingState"]');
    await expect(state).toHaveValue('unknown');
    await expect(page.getByText('ADDITIONAL INFORMATION NEEDED')).toBeVisible();
    await state.selectOption('stable_cooling');
    await expect(page.locator('[data-wic-context="operatingState"]')).toHaveValue('stable_cooling');
    await expect(page.getByText('ADDITIONAL INFORMATION NEEDED')).toBeVisible();
    await page.locator('[data-wic-context="operatingState"]').selectOption('unknown');
    await expect(page.locator('[data-wic-context="operatingState"]')).toHaveValue('unknown');
    await expect(page.getByText('ADDITIONAL INFORMATION NEEDED')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('recording room evidence survives System Check re-render', async ({page}) => {
  await openCheck(page, 'walk_in_cooler');
  const room=page.locator('details').filter({has: page.locator('summary', {hasText: 'Room / control evidence'})});
  await room.locator('summary').click();
  await page.locator('[data-observation-component="room"][data-observation-field="warm_product_load"]').selectOption('large_warm_load');
  await expect(page.locator('[data-observation-component="room"][data-observation-field="warm_product_load"]')).toHaveValue('large_warm_load');
  await page.locator('[data-wic-context="operatingState"]').selectOption('stable_cooling');
  // Some app versions collapse the evidence panel on re-render; reopen if needed.
  const updated=page.locator('details').filter({has: page.locator('summary', {hasText: 'Room / control evidence'})});
  if (!(await updated.getAttribute('open'))) await updated.locator('summary').click();
  await expect(page.locator('[data-observation-component="room"][data-observation-field="warm_product_load"]')).toHaveValue('large_warm_load');
});
