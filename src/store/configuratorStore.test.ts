import { describe, it, expect } from 'vitest'
import {
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  CarConfiguration,
  useConfiguratorStore
} from './configuratorStore'

describe('configuratorStore pure functions', () => {
  describe('calculateTotalPrice', () => {
    it('should calculate base price correctly without optionals and sport wheels', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: []
      }

      // Base price is 40000
      expect(calculateTotalPrice(config)).toBe(40000)
    })

    it('should add 2000 for sport wheels', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: []
      }

      // Base price 40000 + 2000 sport wheels
      expect(calculateTotalPrice(config)).toBe(42000)
    })

    it('should calculate optionals correctly', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'aero',
        optionals: ['precision-park', 'flux-capacitor']
      }

      // Base: 40000, precision-park: 5500, flux-capacitor: 5000 = 50500
      expect(calculateTotalPrice(config)).toBe(50500)
    })

    it('should calculate optionals and sport wheels together', () => {
      const config: CarConfiguration = {
        exteriorColor: 'glacier-blue',
        interiorColor: 'carbon-black',
        wheelType: 'sport',
        optionals: ['flux-capacitor']
      }

      // Base: 40000, sport: 2000, flux: 5000 = 47000
      expect(calculateTotalPrice(config)).toBe(47000)
    })
  })

  describe('calculateInstallment', () => {
    it('should calculate the installment correctly with 2% compound interest in 12x', () => {
      const total = 40000
      // Formula: (40000 * 0.02 * (1.02)^12) / ((1.02)^12 - 1)
      // ≈ 3782.38
      const installment = calculateInstallment(total)
      expect(installment).toBeCloseTo(3782.38, 1)
    })
  })

  describe('formatPrice', () => {
    it('should format numbers to BRL currency correctly', () => {
      // Intl.NumberFormat in Node might have slightly different output depending on the version/locale
      // We check for the R$ symbol and the presence of the number
      const formatted = formatPrice(40000)

      // Replacing non-breaking spaces for a reliable check
      const normalizedStr = formatted.replace(/\xa0/g, ' ')

      expect(normalizedStr).toMatch(/R\$\s?40\.000,00/)
    })
  })
})

describe('configuratorStore actions', () => {
  it('should toggle an optional feature correctly', () => {
    // Reset state before test
    useConfiguratorStore.getState().resetConfiguration()

    // Initial state has no optionals
    expect(useConfiguratorStore.getState().configuration.optionals).toEqual([])

    // Toggle a feature (should add it)
    useConfiguratorStore.getState().toggleOptional('precision-park')
    expect(useConfiguratorStore.getState().configuration.optionals).toContain('precision-park')

    // Toggle the same feature (should remove it)
    useConfiguratorStore.getState().toggleOptional('precision-park')
    expect(useConfiguratorStore.getState().configuration.optionals).not.toContain('precision-park')
  })

  it('should handle login logic depending on previous orders', () => {
    useConfiguratorStore.setState({ orders: [] })
    useConfiguratorStore.getState().logout()

    // Login fails if there are no orders for the email
    const loginResult1 = useConfiguratorStore.getState().login('test@example.com')
    expect(loginResult1).toBe(false)
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull()

    // Add a mock order
    useConfiguratorStore.setState({
      orders: [
        {
          id: '1',
          configuration: { exteriorColor: 'glacier-blue', interiorColor: 'carbon-black', wheelType: 'aero', optionals: [] },
          totalPrice: 40000,
          customer: { name: 'Test', lastname: 'User', email: 'test@example.com', phone: '', document: '', store: '' },
          paymentMethod: 'avista',
          status: 'APROVADO',
          createdAt: new Date().toISOString()
        }
      ]
    })

    // Login succeeds now
    const loginResult2 = useConfiguratorStore.getState().login('test@example.com')
    expect(loginResult2).toBe(true)
    expect(useConfiguratorStore.getState().currentUserEmail).toBe('test@example.com')
  })
})