import { deleteOrderByDocument } from '../support/database/orderRepository'
import { test, expect } from '../support/fixtures'

test.describe('Checkout', () => {


  test.describe('Validações de campos obrigatórios', () => {

    let alerts: any

    test.beforeEach(async ({ page, app }) => {
      await page.goto('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()

      alerts = app.checkout.elements.alerts
    })


    test('deve validar obrigatoriedade de todos os campos em branco', async ({ app }) => {
      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(alerts.email).toHaveText('Email inválido')
      await expect(alerts.phone).toHaveText('Telefone inválido')
      await expect(alerts.document).toHaveText('CPF inválido')
      await expect(alerts.store).toHaveText('Selecione uma loja')
      await expect(alerts.terms).toHaveText('Aceite os termos')
    })

    test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ app }) => {
      const customer = {
        name: 'A',
        lastname: 'B',
        email: 'samir@teste.com',
        document: '00000014141',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.name)
        .toHaveText('Nome deve ter pelo menos 2 caracteres')

      await expect(alerts.lastname)
        .toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir erro para e-mail com formato inválido', async ({ app }) => {
      const customer = {
        name: 'Samir',
        lastname: 'Andrade',
        email: 'samir@.com',
        document: '00000014141',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.email).toHaveText('Email inválido')
    })

    test('deve exibir erro para CPF inválido', async ({ app }) => {
      const customer = {
        name: 'Samir',
        lastname: 'Andrade',
        email: 'samir@teste.com',
        document: '00000014199',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.document).toHaveText('CPF inválido')
    })

    test('deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ app }) => {
      const customer = {
        name: 'Samir',
        lastname: 'Andrade',
        email: 'samir@teste.com',
        document: '00000014141',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await expect(app.checkout.elements.terms).not.toBeChecked()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.terms).toHaveText('Aceite os termos')
    })

  })

  test.describe('Pagamento e Confirmação', () => {

    test('deve finalizar pedido com sucesso para pagamento à vista', async ({ app, page }) => {
      const customer = {
        name: 'João',
        lastname: 'Silva',
        email: 'joao.silva@gmail.com',
        document: '92349551024',
        phone: '(11) 98888-8888',
        store: 'Velô Paulista',
        paymentMethod: 'À Vista',
        totalPrice: 'R$ 40.000,00'
      }

      await deleteOrderByDocument(customer.document);

      // Arrange
      await page.goto('/')
      await page.getByRole('link', { name: 'Configure Agora' }).click()
      await app.configure.finishConfigurator()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)
      await app.checkout.acceptTerms()
      await app.checkout.expectSummaryTotal(customer.totalPrice)

      // Act
      await app.checkout.submit()

      // Assert
      await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible()
      await expect(page.getByText('Seu pedido foi processado com sucesso. Em breve entraremos em contato.')).toBeVisible()
    })

    test('deve aprovar automáticamente o crédito quando o score do CPF for maior que 700 no financiamento.', async ({ app, page }) => {
      const customer = {
        name: 'Steve',
        lastname: 'Woz',
        email: 'woz@velo.com',
        document: '20517656000',
        phone: '(11) 98888-8888',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00'
      }

      await deleteOrderByDocument(customer.document);

      await page.route('**/functions/v1/credit-analysis', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'Done',
            score: 710,
          })
        })
      })

      // Arrange
      await page.goto('/')
      await page.getByRole('link', { name: 'Configure Agora' }).click()
      await app.configure.finishConfigurator()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)
      await app.checkout.expectSummaryTotal(customer.totalPrice)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      //await app.checkout.expectSummaryTotal(customer.totalPrice)
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible()
    })

    test('deve encaminhar para análise de crédito quando o score do CPF for entre 501 e 700 no financiamento.', async ({ app, page }) => {
      const customer = {
        name: 'Ana',
        lastname: 'Silva',
        email: 'ana.silva@velo.com',
        document: '92660984000',
        phone: '(11) 98888-8888',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00'
      }

      await deleteOrderByDocument(customer.document);

      await page.route('**/functions/v1/credit-analysis', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'Done',
            score: 600,
          })
        })
      })

      // Arrange
      await page.goto('/')
      await page.getByRole('link', { name: 'Configure Agora' }).click()
      await app.configure.finishConfigurator()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)
      await app.checkout.expectSummaryTotal(customer.totalPrice)

      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(page.getByRole('heading', { name: 'Pedido em Análise!' })).toBeVisible()
    })

  })

})