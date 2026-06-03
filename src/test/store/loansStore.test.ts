import { beforeEach, describe, expect, it } from 'vitest'
import { useBooksStore } from '../../store/booksStore'
import { useLoansStore } from '../../store/loansStore'

describe('useLoansStore', () => {
  beforeEach(() => {
    useLoansStore.setState({ loans: [] })
    useBooksStore.setState({ books: [] })
  })

  it('crea un préstamo y reduce la disponibilidad del libro', () => {
    useBooksStore.setState({
      books: [
        {
          id: 'book-1',
          title: 'Rayuela',
          author: 'Julio Cortázar',
          category: 'Novela',
          isbn: '978-1-23-456789-7',
          year: 1963,
          available: 3,
          createdAt: '2026-06-03',
          popularity: 10,
        },
      ],
    })

    const loan = {
      id: 'loan-1',
      bookId: 'book-1',
      userName: 'Daniel',
      loanDate: '2026-06-03',
      status: 'active' as const,
    }

    useLoansStore.getState().createLoan(loan)

    expect(useLoansStore.getState().loans).toHaveLength(1)
    expect(useLoansStore.getState().loans[0]).toEqual(loan)
    expect(useBooksStore.getState().books[0].available).toBe(2)
  })

  it('no crea un préstamo si el libro no tiene disponibilidad', () => {
    useBooksStore.setState({
      books: [
        {
          id: 'book-1',
          title: 'Rayuela',
          author: 'Julio Cortázar',
          category: 'Novela',
          isbn: '978-1-23-456789-7',
          year: 1963,
          available: 0,
          createdAt: '2026-06-03',
          popularity: 10,
        },
      ],
    })

    const loan = {
      id: 'loan-1',
      bookId: 'book-1',
      userName: 'Daniel',
      loanDate: '2026-06-03',
      status: 'active' as const,
    }

    useLoansStore.getState().createLoan(loan)

    expect(useLoansStore.getState().loans).toHaveLength(0)
    expect(useBooksStore.getState().books[0].available).toBe(0)
  })

  it('devuelve un préstamo y aumenta la disponibilidad del libro', () => {
    useBooksStore.setState({
      books: [
        {
          id: 'book-1',
          title: 'Rayuela',
          author: 'Julio Cortázar',
          category: 'Novela',
          isbn: '978-1-23-456789-7',
          year: 1963,
          available: 2,
          createdAt: '2026-06-03',
          popularity: 10,
        },
      ],
    })

    useLoansStore.setState({
      loans: [
        {
          id: 'loan-1',
          bookId: 'book-1',
          userName: 'Daniel',
          loanDate: '2026-06-03',
          status: 'active',
        },
      ],
    })

    useLoansStore.getState().returnLoan('loan-1')

    const loan = useLoansStore.getState().loans[0]

    expect(loan.status).toBe('returned')
    expect(loan.returnDate).toBeDefined()
    expect(useBooksStore.getState().books[0].available).toBe(3)
  })

  it('elimina un préstamo con cancelLoan', () => {
    useLoansStore.setState({
      loans: [
        {
          id: 'loan-1',
          bookId: 'book-1',
          userName: 'Daniel',
          loanDate: '2026-06-03',
          status: 'active',
        },
        {
          id: 'loan-2',
          bookId: 'book-2',
          userName: 'Camila',
          loanDate: '2026-06-03',
          status: 'active',
        },
      ],
    })

    useLoansStore.getState().cancelLoan('loan-1')

    const loans = useLoansStore.getState().loans

    expect(loans).toHaveLength(1)
    expect(loans[0].id).toBe('loan-2')
  })
})