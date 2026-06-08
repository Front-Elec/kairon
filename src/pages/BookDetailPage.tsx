import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore } from '@/store/loansStore';
import type { Loan } from '@/types/loan';
import { v4 as uuidv4 } from 'uuid';

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const books = useBooksStore((state) => state.books);
  const { createLoan } = useLoansStore();
  const session = useAuthStore((state) => state.session);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

  const book = books.find((item) => item.id === id);

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-in fade-in zoom-in duration-500 max-w-md mx-auto">
        <div className="bg-red-50 p-6 rounded-full border border-red-100 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            <path d="m10 9 4 4"/>
            <path d="m14 9-4 4"/>
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Libro no encontrado</h1>
          <p className="text-secondary text-base">El libro solicitado no existe o fue eliminado.</p>
          <p className="text-sm text-gray-400">Es posible que el identificador sea incorrecto o que el libro haya sido retirado de nuestra colección digital.</p>
        </div>
        <Button onClick={() => navigate('/')} className="px-8 py-3 w-full sm:w-auto">
          Volver al Catálogo
        </Button>
      </div>
    );
  }

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.username) {
      alert('No se pudo identificar al usuario actual');
      return;
    }

    const newLoan: Loan = {
      id: uuidv4().toString(),
      bookId: book.id,
      userName: session.username,
      loanDate: new Date().toISOString(),
      status: 'active',
    };

    createLoan(newLoan);
    alert('¡Préstamo registrado exitosamente!');
    setIsLoanModalOpen(false);
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
          <div className="aspect-[2/3] bg-gradient-to-br from-blue-600 to-indigo-900 rounded-xl shadow-lg flex flex-col items-center justify-between p-6 text-center border border-white/10 relative overflow-hidden group min-h-[350px]">
            {/* Elegant glass reflection effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Category tag */}
            <span className="text-xs font-semibold tracking-wider text-blue-100 uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-white/10 z-10">
              {book.category}
            </span>
            
            {/* Book Info inside cover */}
            <div className="space-y-3 py-4 z-10">
              <h2 className="text-2xl font-bold text-white line-clamp-3 leading-tight drop-shadow-sm px-2">
                {book.title}
              </h2>
              <p className="text-sm text-blue-200 font-medium italic">
                {book.author}
              </p>
            </div>
            
            {/* Decorative book binder element */}
            <div className="w-10 h-1 bg-white/20 rounded-full z-10" />
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/10 backdrop-blur-[1px] border-r border-white/5" />
          </div>
        </section>

        <section className="md:col-span-2 space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{book.category}</Badge>
              <Badge variant={book.available > 0 ? 'primary' : 'secondary'}>
                {book.available > 0 ? 'Disponible' : 'Prestado'}
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
                  {book.description || "Este libro no cuenta con un resumen disponible actualmente en nuestro catálogo digital."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary/10">
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase">Año de publicación</h4>
                  <p className="font-medium">{book.year !== undefined && book.year !== 0 ? book.year : "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase">ISBN</h4>
                  <p className="font-medium">{book.isbn || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <footer className="flex gap-4 pt-4">
            <Button 
              className="flex-grow py-6 text-lg" 
              disabled={book.available <= 0}
              variant={book.available > 0 ? 'primary' : 'secondary'}
              onClick={() => setIsLoanModalOpen(true)}
            >
              {book.available > 0 ? 'Solicitar Préstamo' : 'No disponible'}
            </Button>
            <Button variant="secondary" className="px-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </Button>
          </footer>
        </section>
      </div>

      <Modal 
        isOpen={isLoanModalOpen} 
        onClose={() => {
          setIsLoanModalOpen(false);
        }} 
        title="Solicitar Préstamo"
      >
        <form onSubmit={handleLoanSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-secondary/10">
            <p className="font-semibold">{book.title}</p>
            <p className="text-sm text-secondary">{book.author}</p>
          </div>
          
          <div className="rounded-lg border border-secondary/10 bg-primary/5 px-4 py-3 text-sm text-secondary">
            Este préstamo quedará registrado a nombre de{' '}
            <span className="font-semibold text-gray-900">{session?.username}</span>.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsLoanModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Confirmar Solicitud
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
