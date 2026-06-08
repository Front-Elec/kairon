import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BookForm } from "../../components/BookForm"
import { useBooksStore } from '../../store/booksStore'
import type { Book } from '../../types/book'

const makeBook = (overrides: Partial<Book> = {}): Book => ({
  id: 'book-1',
  title: 'Rayuela',
  author: 'Julio Cortázar',
  category: 'Novela',
  isbn: '978-1-23-456789-7',
  year: 1963,
  quantity: 3,
  available: 3,
  createdAt: '2026-06-08T00:00:00.000Z',
  popularity: 10,
  ...overrides,
})

describe('BookForm', () => {
  beforeEach(() => {
    localStorage.clear()
    useBooksStore.setState({ books: [] })
  })

  it('renderiza los campos principales del formulario', () => {
    render(<BookForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByText('Título del Libro')).toBeInTheDocument()
    expect(screen.getByText('Autor')).toBeInTheDocument()
    expect(screen.getByText('Categoría')).toBeInTheDocument()
    expect(screen.getByText('ISBN')).toBeInTheDocument()
    expect(screen.getByText('Año de Publicación')).toBeInTheDocument()
    expect(screen.getByText('Cantidad')).toBeInTheDocument()
    expect(screen.getByText('Descripción')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar libro/i })).toBeInTheDocument()
  })

  it('muestra errores cuando se envía el formulario vacío', async () => {
    const user = userEvent.setup()

    render(<BookForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    await user.clear(screen.getByPlaceholderText('Ej: Rayuela'))
    await user.clear(screen.getByPlaceholderText('Ej: Julio Cortázar'))
    await user.clear(screen.getByPlaceholderText('Ej: Novela'))
    await user.clear(screen.getByPlaceholderText('Ej: 978-84-376-0494-7'))

    await user.click(screen.getByRole('button', { name: /registrar libro/i }))

    expect(screen.getByText('El título es requerido')).toBeInTheDocument()
    expect(screen.getByText('El autor es requerido')).toBeInTheDocument()
    expect(screen.getByText('La categoría es requerida')).toBeInTheDocument()
    expect(screen.getByText(/ISBN inválido \(10 o 13 dígitos\)/i)).toBeInTheDocument()
  })

  it('llama onSubmit con los datos correctos cuando el formulario es válido', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<BookForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('Ej: Rayuela'), 'Rayuela')
    await user.type(screen.getByPlaceholderText('Ej: Julio Cortázar'), 'Julio Cortázar')
    await user.type(screen.getByPlaceholderText('Ej: Novela'), 'Novela')
    await user.type(screen.getByPlaceholderText('Ej: 978-84-376-0494-7'), '978-1-23-456789-7')

    await user.click(screen.getByRole('button', { name: /registrar libro/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Rayuela',
      author: 'Julio Cortázar',
      category: 'Novela',
      isbn: '978-1-23-456789-7',
      year: new Date().getFullYear(),
      quantity: 1,
      description: '',
    })
  })

  it('llama onCancel cuando se hace click en Cancelar', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(<BookForm onSubmit={vi.fn()} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('muestra error de ISBN duplicado y bloquea el submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    useBooksStore.setState({
      books: [makeBook()],
    })

    render(<BookForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('Ej: Rayuela'), 'Nuevo libro')
    await user.type(screen.getByPlaceholderText('Ej: Julio Cortázar'), 'Otra autora')
    await user.type(screen.getByPlaceholderText('Ej: Novela'), 'Ensayo')
    await user.type(screen.getByPlaceholderText('Ej: 978-84-376-0494-7'), '9781234567897')

    expect(screen.getByText('Este ISBN ya está registrado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar libro/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /registrar libro/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('permite enviar el formulario cuando el ISBN no está duplicado', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    useBooksStore.setState({
      books: [makeBook()],
    })

    render(<BookForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('Ej: Rayuela'), 'Pedro Páramo')
    await user.type(screen.getByPlaceholderText('Ej: Julio Cortázar'), 'Juan Rulfo')
    await user.type(screen.getByPlaceholderText('Ej: Novela'), 'Realismo mágico')
    await user.type(screen.getByPlaceholderText('Ej: 978-84-376-0494-7'), '9780307474278')

    expect(screen.queryByText('Este ISBN ya está registrado')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar libro/i })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: /registrar libro/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('en modo edición no considera duplicado su propio ISBN', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    useBooksStore.setState({
      books: [makeBook()],
    })

    render(
      <BookForm
        initialData={{
          title: 'Rayuela',
          author: 'Julio Cortázar',
          category: 'Novela',
          isbn: '978-1-23-456789-7',
          year: 1963,
          quantity: 3,
          description: '',
        }}
        editingId="book-1"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />
    )

    expect(screen.queryByText('Este ISBN ya está registrado')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: /guardar cambios/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('muestra error de formato cuando el ISBN tiene longitud inválida', async () => {
    const user = userEvent.setup()

    render(<BookForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    await user.type(screen.getByPlaceholderText('Ej: 978-84-376-0494-7'), '123456789')

    expect(screen.getByRole('button', { name: /registrar libro/i })).toBeDisabled()

    await user.clear(screen.getByPlaceholderText('Ej: 978-84-376-0494-7'))
    await user.type(screen.getByPlaceholderText('Ej: 978-84-376-0494-7'), '12345678901')
    await user.click(screen.getByRole('button', { name: /registrar libro/i }))

    expect(screen.getByText(/ISBN inválido \(10 o 13 dígitos\)/i)).toBeInTheDocument()
  })
})
