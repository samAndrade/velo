import { test } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configure.open()
  })

  test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    await app.configure.expectPrice('R$ 40.000,00')

    await app.configure.selectColor('Midnight Black')
    await app.configure.expectPrice('R$ 40.000,00')
    await app.configure.expectCarImageSrc(/midnight-black-aero-wheels/)
  })

  test('deve atualizar o preço base e a imagem ao alterar as rodas, e restaurar os valores padrões', async ({ app }) => {
    await app.configure.expectPrice('R$ 40.000,00')

    await app.configure.selectWheels(/Sport Wheels/)
    await app.configure.expectPrice('R$ 42.000,00')
    await app.configure.expectCarImageSrc(/glacier-blue-sport-wheels/)

    await app.configure.selectWheels(/Aero Wheels/)
    await app.configure.expectPrice('R$ 40.000,00')
    await app.configure.expectCarImageSrc(/glacier-blue-aero-wheels/)
  })

  test('deve atualizar o preço ao selecionar opcionais e manter valores no checkout', async ({ app }) => {
    await app.configure.expectPrice('R$ 40.000,00')

    await app.configure.checkOptional(/Precision Park/i)
    await app.configure.expectPrice('R$ 45.500,00')

    await app.configure.checkOptional(/Flux Capacitor/i)
    await app.configure.expectPrice('R$ 50.500,00')

    await app.configure.uncheckOptional(/Precision Park/i)
    await app.configure.uncheckOptional(/Flux Capacitor/i)
    await app.configure.expectPrice('R$ 40.000,00')

    await app.configure.finishConfigurator()
    await app.checkout.expectLoaded()
    await app.checkout.expectSummaryTotal('R$ 40.000,00')
  })
})
