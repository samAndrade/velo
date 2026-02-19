export function generateOrderCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'

  const randomLetters = (length) =>
    Array.from({ length }, () => letters[Math.floor(Math.random() * letters.length)]).join('')

  const randomNumbers = (length) =>
    Array.from({ length }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('')

  const prefix = 'VLO'
  const partLetters = randomLetters(3)
  const partNumbers = randomNumbers(3)

  return `${prefix}-${partLetters}${partNumbers}`
}