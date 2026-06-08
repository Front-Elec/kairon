import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
// import { BookForm } from 'src/components/BookForm'
import { BookForm } from "../../components/BookForm"

describe('BookForm', () => {
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
})
