import { Page } from '@playwright/test'

export async function mockCreditAnalysis(page: Page, score: number, status: 'Done' | 'Pending' = 'Done') {
  await page.route('**/functions/v1/credit-analysis', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status, score }),
    })
  })
}
