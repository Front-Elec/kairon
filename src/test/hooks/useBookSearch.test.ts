import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useBookSearch } from '../../hooks/useBookSearch'
import type { Book } from '../../types/book'

const books: Book[] = [
  {
    id: '1',
    title: 'Rayuela',
    author: 'Julio Cortázar',
    category: 'Novela',
    isbn: '978-1-23-456789-7',
    year: 1963,
    available: 3,
    createdAt: '2026-06-01',
    popularity: 20,
  },
  {
    id: '2',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    category: 'Novela',
    isbn: '978-1-23-456789-8',
    year: 1967,
    available: 0,
    createdAt: '2026-06-03',
    popularity: 50,
  },
  {
    id: '3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programación',
    isbn: '978-1-23-456789-9',
    year: 2008,
    available: 2,
    createdAt: '2026-05-20',
    popularity: 40,
  },
]

describe('useBookSearch', () => {
  it('devuelve todos los libros cuando no hay filtros', () => {
    const { result } = renderHook(() =>
      useBookSearch({
        books,
        searchText: '',
        category: 'all',
        availability: 'all',
        sortBy: 'az',
      })
    )

    expect(result.current).toHaveLength(3)
  })

  it('filtra libros por título o autor', () => {
    const { result } = renderHook(() =>
      useBookSearch({
        books,
        searchText: 'rayuela',
        category: 'all',
        availability: 'all',
        sortBy: 'az',
      })
    )

    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('Rayuela')
  })

  it('filtra libros por categoría', () => {
    const { result } = renderHook(() =>
      useBookSearch({
        books,
        searchText: '',
        category: 'Programación',
        availability: 'all',
        sortBy: 'az',
      })
    )

    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('Clean Code')
  })

  it('filtra libros disponibles', () => {
    const { result } = renderHook(() =>
      useBookSearch({
        books,
        searchText: '',
        category: 'all',
        availability: 'available',
        sortBy: 'az',
      })
    )

    expect(result.current.every((book) => book.available > 0)).toBe(true)
  })

  it('ordena libros por popularidad', () => {
    const { result } = renderHook(() =>
      useBookSearch({
        books,
        searchText: '',
        category: 'all',
        availability: 'all',
        sortBy: 'popularity',
      })
    )

    expect(result.current[0].title).toBe('Cien años de soledad')
    expect(result.current[1].title).toBe('Clean Code')
    expect(result.current[2].title).toBe('Rayuela')
  })
})