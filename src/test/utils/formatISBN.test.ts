import { describe, expect, it } from 'vitest'
import { formatISBN } from '../../utils/formatISBN'

describe('formatISBN', () => {
  it('convierte 13 dígitos al formato con guiones', () => {
    expect(formatISBN('9780307474728')).toBe('978-0-30-747472-8')
  })

  it('normaliza una cadena de 13 dígitos aunque llegue con espacios o guiones', () => {
    expect(formatISBN('978 0 14 312755 0')).toBe('978-0-14-312755-0')
  })

  it('devuelve el valor original cuando la longitud no es válida', () => {
    expect(formatISBN('1234567890')).toBe('1234567890')
  })
})
