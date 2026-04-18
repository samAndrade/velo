import { test } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configure.open()
  })

  test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    await app.configure.expectPrice('R$ 40.000,00')

    await app.configure.selectColor('Midnight Black')
    await app.configure.expectPrice('R$ 40.000,00')
    await app.configure.expectCarImage('/src/assets/midnight-black-aero-wheels.png')
  })

  test('deve atualizar o preço base e a imagem ao alterar as rodas, e restaurar os valores padrões', async ({ app }) => {
    await app.configure.expectPrice('R$ 40.000,00')

    await app.configure.selectWheels(/Sport Wheels/)
    await app.configure.expectPrice('R$ 42.000,00')
    await app.configure.expectCarImage('/src/assets/glacier-blue-sport-wheels.png')
    
    await app.configure.selectWheels(/Aero Wheels/)
    await app.configure.expectPrice('R$ 40.000,00')
    await app.configure.expectCarImage('/src/assets/glacier-blue-aero-wheels.png')
  })

  test('deve atualizar o preço ao selecionar opcionais e manter valores no checkout', async ({ app }) => {
    await app.configure.expectPrice('R$ 40.000,00')
    await app.configure.expectOptionalVisible('precisionPark')
    await app.configure.expectOptionalVisible('fluxCapacitor')

    await app.configure.checkOptional('precisionPark')
    await app.configure.expectPrice('R$ 45.500,00')

    await app.configure.checkOptional('fluxCapacitor')
    await app.configure.expectPrice('R$ 50.500,00')

    await app.configure.uncheckOptional('precisionPark')
    await app.configure.uncheckOptional('fluxCapacitor')
    await app.configure.expectPrice('R$ 40.000,00')

    await app.configure.proceedToCheckout()
    await app.configure.expectCheckoutPageLoaded()
    await app.configure.expectCheckoutTotal('R$ 40.000,00')
  })
})
