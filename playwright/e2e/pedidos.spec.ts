import { test, expect } from '@playwright/test'

/// AAA - Arrange, Act, Assert


test('deve consultar um pedido aprovado', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/')

  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-REA548')
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  // Assert
  const orderId = page.getByTestId('order-result-VLO-REA548')

  await expect(orderId.getByText('VLO-REA548')).toBeVisible({timeout: 10_000})
  await expect(orderId).toContainText('VLO-REA548')

  await expect(orderId.getByText('APROVADO')).toBeVisible()
  await expect(orderId).toContainText('APROVADO')


})