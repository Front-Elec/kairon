import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore, type Loan } from '@/store/loansStore';
import { BookUp, CheckCircle2, Info } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const LoansPage = () => {
  const { loans, returnLoan, createLoan, cancelLoan } = useLoansStore();
  const { books } = useBooksStore();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);
  const [newLoanForm, setNewLoanForm] = useState({ bookId: '', userName: '' });

  const getStatusBadge = useCallback((status: Loan['status']) => {
    switch (status) {
      case 'active':   return <Badge variant="primary">Activo</Badge>;
      case 'returned': return <Badge variant="secondary">Devuelto</Badge>;
      case 'cancelled':  return <Badge variant="accent">Cancelado</Badge>;
    }
  }, []);

  const loanStats = useMemo(() => {
    const active   = loans.filter((l) => l.status === 'active').length;
    const cancelled  = loans.filter((l) => l.status === 'cancelled').length;
    const returned = loans.filter((l) => l.status === 'returned').length;
    return { active, cancelled, returned, total: loans.length };
  }, [loans]);

  const handleReturnClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsReturnModalOpen(true);
  };

  const handleDetailClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsDetailModalOpen(true);
  };

  const confirmReturn = () => {
    if (selectedLoan) {
      returnLoan(selectedLoan.id);
      setIsReturnModalOpen(false);
      setSelectedLoan(null);
    }
  };

  const confirmNewLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const book = books.find(b => b.id === newLoanForm.bookId);

    if (!book) {
      alert('Por favor selecciona un libro válido');
      return;
    }

    if (book.available <= 0) {
      alert('Este libro no está disponible');
      return;
    }

    if (!newLoanForm.userName.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    const newLoan: Loan = {
      id: uuidv4().toString(),
      bookId: newLoanForm.bookId,
      userName: newLoanForm.userName,
      loanDate: new Date().toISOString(),
      status: 'active',
    };

    createLoan(newLoan);
    setIsNewLoanModalOpen(false);
    setNewLoanForm({ bookId: '', userName: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Préstamos</h1>
          <p className="text-secondary mt-1">Historial y estado actual de los libros prestados.</p>
        </div>
        <Button variant="primary" onClick={() => setIsNewLoanModalOpen(true)} className="flex items-center gap-2">
          <BookUp size={18} />
          Registrar Préstamo
        </Button>
      </header>

      <div className="grid grid-cols-3 gap-4 text-center" role="region" aria-label="Resumen de préstamos">
        <div className="bg-white border border-secondary/10 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-primary" aria-label={`${loanStats.active} préstamos activos`}>{loanStats.active}</p>
          <p className="text-xs text-secondary mt-1">Activos</p>
        </div>
        <div className="bg-white border border-secondary/10 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-accent" aria-label={`${loanStats.cancelled} préstamos cancelados`}>{loanStats.cancelled}</p>
          <p className="text-xs text-secondary mt-1">Cancelados</p>
        </div>
        <div className="bg-white border border-secondary/10 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-400" aria-label={`${loanStats.returned} préstamos devueltos`}>{loanStats.returned}</p>
          <p className="text-xs text-secondary mt-1">Devueltos</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left border-collapse relative" aria-label="Tabla de préstamos">
              <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                <tr className="border-b border-secondary/10">
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Libro</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider hidden md:table-cell">Usuario</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider hidden md:table-cell">Fecha Préstamo</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Fecha Devolución</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Estado</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/5">
                {loans.map((loan) => {
                  const book = books.find(b => b.id === loan.bookId);
                  const loanDateObj = new Date(loan.loanDate);
                  const defaultDueDate = new Date(loanDateObj);
                  defaultDueDate.setDate(defaultDueDate.getDate() + 14);

                  return (
                    <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{book?.title || 'Libro Desconocido'}</div>
                        <div className="text-xs text-secondary">{book?.author || 'Autor Desconocido'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{loan.userName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{loanDateObj.toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{defaultDueDate.toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {getStatusBadge(loan.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleDetailClick(loan)} className="p-1 text-gray-500 hover:text-primary transition-colors" title="Ver Detalle">
                            <Info size={18} />
                          </button>
                          {loan.status !== 'returned' && (
                            <button onClick={() => handleReturnClick(loan)} className="p-1 text-gray-500 hover:text-green-600 transition-colors" title="Marcar como Devuelto">
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isReturnModalOpen} onClose={() => setIsReturnModalOpen(false)} title="Confirmar Devolución">
        <div className="space-y-4">
          <p>¿Estás seguro de que deseas marcar el libro <strong>{selectedLoan && books.find(b => b.id === selectedLoan.bookId)?.title}</strong> como devuelto?</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsReturnModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={confirmReturn}>Confirmar</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detalle del Préstamo">
        {selectedLoan && (() => {
          const book = books.find(b => b.id === selectedLoan.bookId);
          const loanDateObj = new Date(selectedLoan.loanDate);
          const defaultDueDate = new Date(loanDateObj);
          defaultDueDate.setDate(defaultDueDate.getDate() + 14);

          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div><span className="font-semibold block text-gray-500">Libro:</span> {book?.title || 'Desconocido'}</div>
                <div><span className="font-semibold block text-gray-500">Autor:</span> {book?.author || 'Desconocido'}</div>
                <div><span className="font-semibold block text-gray-500">Usuario:</span> {selectedLoan.userName}</div>
                <div><span className="font-semibold block text-gray-500">Estado:</span> {selectedLoan.status}</div>
                <div><span className="font-semibold block text-gray-500">Fecha de Préstamo:</span> {loanDateObj.toLocaleDateString()}</div>
                <div><span className="font-semibold block text-gray-500">Fecha Límite:</span> {defaultDueDate.toLocaleDateString()}</div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Cerrar</Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      <Modal isOpen={isNewLoanModalOpen} onClose={() => setIsNewLoanModalOpen(false)} title="Registrar Préstamo">
        <form onSubmit={confirmNewLoan} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Libro</label>
            <select 
              required 
              value={newLoanForm.bookId}
              onChange={(e) => setNewLoanForm({...newLoanForm, bookId: e.target.value})}
              className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Selecciona un libro...</option>
              {books.map((book) => (
                <option key={book.id} value={book.id} disabled={book.available === 0}>
                  {book.title} ({book.available} disponibles)
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Usuario</label>
            <Input 
              required 
              value={newLoanForm.userName}
              onChange={(e) => setNewLoanForm({...newLoanForm, userName: e.target.value})}
              placeholder="Nombre del usuario..." 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Devolución</label>
            <input 
              required 
              type="date" 
              value={newLoanForm.dueDate}
              onChange={(e) => setNewLoanForm({...newLoanForm, dueDate: e.target.value})}
              className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setIsNewLoanModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
