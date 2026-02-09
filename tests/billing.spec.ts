import { test, expect } from '@playwright/test'

test.describe('Billing Tab', () => {
  test('billing tab shows Free plan with upgrade option', async ({ page }) => {
    await page.goto('/teams')
    const firstTeamLink = page.locator('a[href^="/teams/"]').first()
    await expect(firstTeamLink).toBeVisible({ timeout: 10000 })
    await firstTeamLink.click()
    await page.waitForURL(/\/teams\/[^/]+/)

    // Navigate to billing tab via URL
    const url = page.url()
    await page.goto(`${url}?tab=billing`)

    // Should show Free plan
    await expect(page.getByText('Free')).toBeVisible({ timeout: 10000 })

    // Should show Pro features list
    await expect(page.getByText(/Pro features/i)).toBeVisible()

    // Should show upgrade button
    await expect(page.getByText(/Upgrade.+Pro/i)).toBeVisible()
  })

  test('billing tab shows Pro feature descriptions', async ({ page }) => {
    await page.goto('/teams')
    const firstTeamLink = page.locator('a[href^="/teams/"]').first()
    await expect(firstTeamLink).toBeVisible({ timeout: 10000 })
    await firstTeamLink.click()
    await page.waitForURL(/\/teams\/[^/]+/)

    const url = page.url()
    await page.goto(`${url}?tab=billing`)

    // Wait for billing content to load
    await expect(page.getByText(/Pro features/i)).toBeVisible({ timeout: 10000 })

    // Should list Coach feature
    await expect(page.getByText(/Coach/i).first()).toBeVisible()
  })
})

test.describe('Pro Gate — Coach Tab', () => {
  test('coach tab shows Pro gate overlay for free team', async ({ page }) => {
    await page.goto('/teams')
    const firstTeamLink = page.locator('a[href^="/teams/"]').first()
    await expect(firstTeamLink).toBeVisible({ timeout: 10000 })
    await firstTeamLink.click()
    await page.waitForURL(/\/teams\/[^/]+/)

    // Navigate to coach tab
    const url = page.url()
    await page.goto(`${url}?tab=coach`)

    // Should show upgrade overlay (ProGate component)
    await expect(page.getByText(/Upgrade.+Pro/i).first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Home Tab — Upgrade CTA', () => {
  test('home tab shows upgrade card for free team', async ({ page }) => {
    await page.goto('/teams')
    const firstTeamLink = page.locator('a[href^="/teams/"]').first()
    await expect(firstTeamLink).toBeVisible({ timeout: 10000 })
    await firstTeamLink.click()
    await page.waitForURL(/\/teams\/[^/]+/)

    // Home tab is default — check for upgrade CTA
    await expect(page.getByText(/Upgrade.+Pro/i).first()).toBeVisible({ timeout: 10000 })
  })
})
