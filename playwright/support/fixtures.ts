import { test as base } from '@playwright/test'
import { createConfigureActions } from './actions/configureActions'
import { createOrderLookupActions } from './actions/orderLookupActions'

type App = {
  configure: ReturnType<typeof createConfigureActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configure: createConfigureActions(page),
      orderLookup: createOrderLookupActions(page),
    }
    await use(app)
  },
})

export { expect } from '@playwright/test'
