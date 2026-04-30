import { expect, Page } from '@playwright/test'

/*

Resposta enviada para o desafio 2.

export function createConfigureActions(page: Page) {
  const precisionParkCheckbox = page.getByRole('checkbox', { name: /Precision Park/i })
  const fluxCapacitorCheckbox = page.getByRole('checkbox', { name: /Flux Capacitor/i })
  const checkoutButton = page.getByRole('button', { name: 'Monte o Seu' })

  const optionalCheckboxes = {
    precisionPark: precisionParkCheckbox,
    fluxCapacitor: fluxCapacitorCheckbox,
  } as const

  type OptionalName = keyof typeof optionalCheckboxes

  const getOptionalCheckbox = (name: OptionalName) => optionalCheckboxes[name]
 
  
  return {
    async open() {
      await page.goto('/configure')
    },

    async selectColor(name: string) {
      await page.getByRole('button', { name }).click()
    },

    async selectWheels(name: string | RegExp) {
      await page.getByRole('button', { name }).click()
    },

    async expectPrice(price: string) {
      const priceElement = page.getByTestId('total-price')
      await expect(priceElement).toBeVisible()
      await expect(priceElement).toHaveText(price)
    },

    async expectCarImage(src: string) {
      const carImage = page.locator('img[alt^="Velô Sprint"]')
      await expect(carImage).toHaveAttribute('src', src)
    },

    async expectOptionalVisible(name: OptionalName) {
      await expect(getOptionalCheckbox(name)).toBeVisible()
    },

    async checkOptional(name: OptionalName) {
      await getOptionalCheckbox(name).check()
    },

    async uncheckOptional(name: OptionalName) {
      await getOptionalCheckbox(name).uncheck()
    },

    async proceedToCheckout() {
      await expect(checkoutButton).toBeEnabled()
      await checkoutButton.click()
    },

    async expectCheckoutPageLoaded() {
      await expect(page).toHaveURL('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Resumo' })).toBeVisible()
      await expect(page.getByText('Total')).toBeVisible()
    },

    async expectCheckoutTotal(price: string) {
      await expect(page.getByTestId('summary-total-price')).toHaveText(price)
    },
  }
}

*/

export function createConfigureActions(page: Page) {
  const optionalCheckboxes = (name: string | RegExp) => page.getByRole('checkbox', { name })

  return {
    async open() {
      await page.goto('/configure')
    },

    async selectColor(name: string) {
      await page.getByRole('button', { name }).click()
    },

    async selectWheels(name: string | RegExp) {
      await page.getByRole('button', { name }).click()
    },

    async expectPrice(price: string) {
      const priceElement = page.getByTestId('total-price')
      await expect(priceElement).toBeVisible()
      await expect(priceElement).toHaveText(price)
    },

    async expectCarImageSrc(src: string) {
      const carImage = page.locator('img[alt^="Velô Sprint"]')
      await expect(carImage).toHaveAttribute('src', src)
    },

    async checkOptional(name: string | RegExp) {
      await expect(optionalCheckboxes(name)).toBeVisible()
      await optionalCheckboxes(name).check()
    },

    async uncheckOptional(name: string | RegExp) {
      await expect(optionalCheckboxes(name)).toBeVisible()
      await optionalCheckboxes(name).uncheck()
    },

    async finishConfigurator() {
      await page.getByRole('button', { name: 'Monte o Seu' }).click()
    },
  }
}