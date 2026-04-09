import { test } from '../support/fixtures'

/**
 * CT02 - Configuração do Veículo (Cores e Rodas) e Cálculo do Preço Base
 * Valida se as escolhas de cores e rodas ("Sport") refletem corretamente no preço final.
 */
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
})
