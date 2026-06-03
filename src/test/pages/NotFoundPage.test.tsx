import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NotFoundPage } from '../../pages/NotFoundPage'

describe('NotFoundPage', () => {
  it('muestra el contenido de la página 404', () => {
    render(
      <MemoryRouter>
        <NotFoundPage/>
      </MemoryRouter>
    )

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(
      screen.getByText('Vaya, parece que te has perdido en la biblioteca.')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'La página que buscas no existe o ha sido movida a otra sección de nuestro archivo digital.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /volver al catálogo/i })
    ).toBeInTheDocument()
  })

  it('navega al catálogo cuando se hace click en Volver al Catálogo', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/ruta-inexistente']}>
        <Routes>
          <Route path="/" element={<p>Catálogo principal</p>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /volver al catálogo/i }))

    expect(screen.getByText('Catálogo principal')).toBeInTheDocument()
  })
})