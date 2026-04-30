import { test as base } from '@playwright/test'
import { createCheckoutActions } from './actions/checkoutActions'
import { createConfigureActions } from './actions/configuratorActions'
import { createOrderLookupActions } from './actions/orderLookupActions'

type App = {
  configure: ReturnType<typeof createConfigureActions>
  checkout: ReturnType<typeof createCheckoutActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configure: createConfigureActions(page),
      checkout: createCheckoutActions(page),
      orderLookup: createOrderLookupActions(page),
    }
    await use(app)
  },
})

export { expect } from '@playwright/test'
