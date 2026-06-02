import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

// Interface preparada para el Integrante 5
interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  available: boolean;
}

const mockBooks: Book[] = [
  { id: 1, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', category: 'Literatura', available: true },
  { id: 2, title: 'Cien años de soledad', author: 'Gabriel García Márquez', category: 'Novela', available: false },
  { id: 3, title: 'El Principito', author: 'Antoine de Saint-Exupéry', category: 'Infantil', available: true },
  { id: 4, title: '1984', author: 'George Orwell', category: 'Distopía', available: true },
  { id: 5, title: 'Rayuela', author: 'Julio Cortázar', category: 'Novela', available: false },
  { id: 6, title: 'Ficciones', author: 'Jorge Luis Borges', category: 'Cuento', available: true },
  { id: 7, title: 'El túnel', author: 'Ernesto Sabato', category: 'Novela', available: true },
  { id: 8, title: 'Sobre héroes y tumbas', author: 'Ernesto Sabato', category: 'Novela', available: false },
];

export const CatalogPage = () => {
  const [search, setSearch] = useState('');

  /**
   * useCallback: estabiliza el handler del input entre renders.
   * Sin esto, cada render crearía una nueva función, causando
   * re-renders innecesarios en componentes hijos que la reciban como prop.
   */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [] // sin dependencias: la función nunca cambia
  );

  /**
   * useMemo: el filtrado de la lista solo se recalcula cuando cambia
   * el texto de búsqueda. Si el componente re-renderiza por otro motivo,
   * la lista filtrada se reutiliza sin recomputar.
   */
  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return mockBooks;
    return mockBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Catálogo de Libros</h1>
        <p className="text-secondary text-lg">Explora nuestra colección digital y gestiona tus préstamos.</p>
      </header>

      {/* Sección de Filtros */}
      <section className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-secondary/10 shadow-sm">
        <div className="relative w-full flex-grow">
          <Input
            placeholder="Buscar por título o autor..."
            className="pl-4 py-2.5"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {/* Placeholders para filtros extra (Integrante 5) */}
          <div className="px-4 py-2 bg-gray-50 border border-secondary/10 rounded-md text-sm text-secondary cursor-not-allowed">
            Categoría
          </div>
          <div className="px-4 py-2 bg-gray-50 border border-secondary/10 rounded-md text-sm text-secondary cursor-not-allowed">
            Disponibilidad
          </div>
        </div>
      </section>

      {/* Grid Responsive - Mobile First */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant={book.available ? 'primary' : 'secondary'}>
                  {book.available ? 'Disponible' : 'Prestado'}
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
                <button className="text-xs font-semibold text-primary hover:underline underline-offset-4">
                  Ver detalles
                </button>
                {book.available && (
                  <button className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
                    Solicitar
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};
