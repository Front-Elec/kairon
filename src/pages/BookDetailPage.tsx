import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore, type Loan } from '@/store/loansStore';
import { v4 as uuidv4 } from 'uuid';

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useBooksStore();
  const { createLoan } = useLoansStore();

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanForm, setLoanForm] = useState({ userName: '' });

  const book = books.find(b => b.id === id);

  if (!book) {
    return <div className="text-center py-12">Libro no encontrado</div>;
  }

  const handleLoanSubmit = (e: React.FormEvent) => {
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
    setLoanForm({ userName: '' });
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
          setLoanForm({ userName: '' });
        }} 
        title="Solicitar Préstamo"
      >
        <form onSubmit={handleLoanSubmit} className="space-y-4">
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
