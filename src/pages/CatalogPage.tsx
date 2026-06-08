import { useMemo, useState, useCallback, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore } from '@/store/loansStore';
import type { Loan } from '@/types/loan';
import { useBookSearch, type AvailabilityFilter, type BookSortOption } from '@/hooks/useBookSearch';
import { v4 as uuidv4 } from 'uuid';

const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'available', label: 'Disponibles' },
  { value: 'unavailable', label: 'Prestadas' },
];

const sortOptions: { value: BookSortOption; label: string }[] = [
  { value: 'az', label: 'Título A-Z' },
  { value: 'date', label: 'Más recientes' },
  { value: 'popularity', label: 'Más populares' },
];

export const CatalogPage = () => {
  const navigate = useNavigate();
  const { books } = useBooksStore();
  const { createLoan } = useLoansStore();
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [sortBy, setSortBy] = useState<BookSortOption>('az');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanForm, setLoanForm] = useState({ userName: '' });

  const categories = useMemo(() => {
    const unique = Array.from(new Set(books.map((book) => book.category))).sort();
    return ['all', ...unique];
  }, [books]);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  const handleCategoryChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setCategory(e.target.value);
    },
    []
  );

  const handleAvailabilityChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setAvailability(e.target.value as AvailabilityFilter);
    },
    []
  );

  const handleSortChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value as BookSortOption);
    },
    []
  );

  const filteredBooks = useBookSearch({
    books,
    searchText,
    category,
    availability,
    sortBy,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Catálogo de Libros</h1>
        <p className="text-secondary text-lg">Explora nuestra colección digital y gestiona tus préstamos.</p>
      </header>

      <section aria-label="Filtros de búsqueda" className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr] items-end bg-white p-4 rounded-xl border border-secondary/10 shadow-sm">
        <div className="relative w-full md:col-span-2">
          <label htmlFor="search-books" className="sr-only">Buscar libros</label>
          <Input
            id="search-books"
            placeholder="Buscar por título o autor..."
            className="pl-4 py-2.5"
            value={searchText}
            onChange={handleSearchChange}
            aria-label="Buscar por título o autor"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="category-filter" className="text-xs font-semibold uppercase tracking-wide text-secondary">Categoría</label>
          <select
            id="category-filter"
            className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption === 'all' ? 'Todas' : categoryOption}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="availability-filter" className="text-xs font-semibold uppercase tracking-wide text-secondary">Disponibilidad</label>
          <select
            id="availability-filter"
            className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={availability}
            onChange={handleAvailabilityChange}
          >
            {availabilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="sort-filter" className="text-xs font-semibold uppercase tracking-wide text-secondary">Ordenar</label>
          <select
            id="sort-filter"
            className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={sortBy}
            onChange={handleSortChange}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredBooks.length === 0 ? (
        <div className="rounded-xl border border-secondary/10 bg-white p-8 text-center text-secondary">
          No se encontraron libros con los criterios seleccionados.
        </div>
      ) : (
        <section aria-label="Lista de libros" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <Badge variant={book.available > 0 ? 'primary' : 'secondary'}>
                    {book.available > 0 ? 'Disponible' : 'Prestado'}
                  </Badge>
                  <span className="text-xs text-secondary bg-secondary/5 px-2 py-0.5 rounded">
                    {book.category}
                  </span>
                </div>
                <CardTitle className="mt-4 line-clamp-1 group-hover:text-primary transition-colors">
                  {book.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-gray-600 mb-2">{book.author}</p>
                <p className="text-xs uppercase tracking-wide text-secondary">Stock: {book.available}</p>
                <div className="pt-4 border-t border-secondary/5 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <button
                    className="text-xs font-semibold text-primary hover:underline underline-offset-4"
                    aria-label={`Ver detalles de ${book.title}`}
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    Ver detalles
                  </button>
                  <button
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                      book.available > 0
                        ? 'bg-primary text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-secondary cursor-not-allowed'
                    }`}
                    disabled={book.available === 0}
                    aria-label={book.available > 0 ? `Solicitar préstamo de ${book.title}` : `${book.title} no está disponible`}
                    onClick={() => {
                      if (book.available > 0) {
                        setSelectedBook(book.id);
                        setIsLoanModalOpen(true);
                      }
                    }}
                  >
                    {book.available > 0 ? 'Solicitar' : 'No disponible'}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <Modal
        isOpen={isLoanModalOpen}
        onClose={() => {
          setIsLoanModalOpen(false);
          setSelectedBook(null);
          setLoanForm({ userName: '' });
        }}
        title="Solicitar Préstamo"
      >
        {selectedBook && (() => {
          const book = books.find((b) => b.id === selectedBook);
          if (!book) return null;

          const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (!loanForm.userName.trim()) {
              alert('Por favor ingresa tu nombre');
              return;
            }

            const newLoan: Loan = {
              id: uuidv4().toString(),
              bookId: book.id,
              userName: loanForm.userName,
              loanDate: new Date().toISOString(),
              status: 'active',
            };

            createLoan(newLoan);
            alert('¡Préstamo registrado exitosamente!');
            setIsLoanModalOpen(false);
            setSelectedBook(null);
            setLoanForm({ userName: '' });
          };

          return (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-secondary/10">
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-secondary">{book.author}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tu Nombre</label>
                <Input
                  required
                  value={loanForm.userName}
                  onChange={(e) => setLoanForm({ ...loanForm, userName: e.target.value })}
                  placeholder="Nombre completo..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsLoanModalOpen(false);
                    setSelectedBook(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Confirmar Solicitud
                </Button>
              </div>
            </form>
          );
        })()}
      </Modal>
    </div>
  );
};
