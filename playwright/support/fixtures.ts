import { test as base } from '@playwright/test'
import { createCheckoutActions } from './actions/checkoutActions'
import { createConfigureActions } from './actions/configuratorActions'
import { createOrderLookupActions } from './actions/orderLookupActions'
import { createLandingActions } from './actions/landingActions'
import { mockCreditAnalysis } from './mocks/creditAnalysisMock'

type App = {
  configure: ReturnType<typeof createConfigureActions>
  checkout: ReturnType<typeof createCheckoutActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
  landing: ReturnType<typeof createLandingActions>
  mock: {
    creditAnalysis: (score: number) => Promise<void>
  }
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configure: createConfigureActions(page),
      checkout: createCheckoutActions(page),
      orderLookup: createOrderLookupActions(page),
      landing: createLandingActions(page),
      mock: {
        creditAnalysis: (score: number) => mockCreditAnalysis(page, score),
      },
    }
    await use(app)
  },
})

export { expect } from '@playwright/test'
