import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - Integrante 5 conectará esto a la lógica real
  const book = {
    id,
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes Saavedra',
    year: '1605',
    category: 'Literatura Clásica',
    description: 'La obra maestra de la literatura española relata las aventuras de un hidalgo que, tras leer demasiados libros de caballerías, decide convertirse en caballero andante para deshacer agravios y proteger a los desvalidos.',
    isbn: '978-84-204-1214-6',
    available: true,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button 
        variant="secondary" 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-1">
          <div className="aspect-[2/3] bg-gray-200 rounded-xl shadow-inner flex items-center justify-center text-gray-400">
            <span className="text-sm font-medium">Portada no disponible</span>
          </div>
        </section>

        <section className="md:col-span-2 space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{book.category}</Badge>
              <Badge variant={book.available ? 'primary' : 'secondary'}>
                {book.available ? 'Disponible' : 'Prestado'}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{book.title}</h1>
            <p className="text-xl text-secondary font-medium">por {book.author}</p>
          </header>

          <Card className="bg-white/50 backdrop-blur-sm border-secondary/10">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-2">Resumen</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {book.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary/10">
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase">Año de publicación</h4>
                  <p className="font-medium">{book.year}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase">ISBN</h4>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <footer className="flex gap-4 pt-4">
            <Button 
              className="flex-grow py-6 text-lg" 
              disabled={!book.available}
              variant={book.available ? 'primary' : 'secondary'}
            >
              {book.available ? 'Solicitar Préstamo' : 'Reservar para después'}
            </Button>
            <Button variant="secondary" className="px-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </Button>
          </footer>
        </section>
      </div>
    </div>
  );
};
