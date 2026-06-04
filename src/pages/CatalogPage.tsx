import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore, type Loan } from '@/store/loansStore';
import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const CatalogPage = () => {
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanForm, setLoanForm] = useState({ userName: '' });
  
  const { books } = useBooksStore();
  const { createLoan } = useLoansStore();

  /**
   * useCallback: estabiliza el handler del input entre renders.
   * Sin esto, cada render crearía una nueva función, causando
   * re-renders innecesarios en componentes hijos que la reciban como prop.
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  /**
   * useMemo: el filtrado de la lista solo se recalcula cuando cambia
   * el texto de búsqueda. Si el componente re-renderiza por otro motivo,
   * la lista filtrada se reutiliza sin recomputar.
   */
  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return books;
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }, [search, books]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Catálogo de Libros</h1>
        <p className="text-secondary text-lg">Explora nuestra colección digital y gestiona tus préstamos.</p>
      </header>

      {/* Sección de Filtros */}
      <section aria-label="Filtros de búsqueda" className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-secondary/10 shadow-sm">
        <div className="relative w-full flex-grow">
          <label htmlFor="search-books" className="sr-only">Buscar libros</label>
          <Input
            id="search-books"
            placeholder="Buscar por título o autor..."
            className="pl-4 py-2.5"
            value={search}
            onChange={handleSearchChange}
            aria-label="Buscar por título o autor"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {/* Placeholders para filtros extra (Integrante 5) */}
          <div className="px-4 py-2 bg-gray-50 border border-secondary/10 rounded-md text-sm text-secondary cursor-not-allowed" aria-disabled="true">
            Categoría
          </div>
          <div className="px-4 py-2 bg-gray-50 border border-secondary/10 rounded-md text-sm text-secondary cursor-not-allowed" aria-disabled="true">
            Disponibilidad
          </div>
        </div>
      </section>

      <section aria-label="Lista de libros" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
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
              <p className="text-sm font-medium text-gray-600 mb-4">{book.author}</p>
              <div className="pt-4 border-t border-secondary/5 flex justify-between items-center">
                <button
                  className="text-xs font-semibold text-primary hover:underline underline-offset-4"
                  onClick={() => {
                    setSelectedBook(book.id);
                    setIsLoanModalOpen(true);
                  }}
                  aria-label={`Ver detalles de ${book.title}`}
                >
                  Ver detalles
                </button>
                {book.available > 0 && (
                  <button
                    onClick={() => {
                      setSelectedBook(book.id);
                      setIsLoanModalOpen(true);
                    }}
                    className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                    aria-label={`Solicitar préstamo de ${book.title}`}
                  >
                    Solicitar
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Modal 
        isOpen={isLoanModalOpen} 
        onClose={() => {
          setIsLoanModalOpen(false);
          setSelectedBook(null);
          setLoanForm({ user: '', daysToReturn: '14' });
        }} 
        title="Solicitar Préstamo"
      >
        {selectedBook && (() => {
          const book = books.find(b => b.id === selectedBook);
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
                  onChange={(e) => setLoanForm({...loanForm, userName: e.target.value})}
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
