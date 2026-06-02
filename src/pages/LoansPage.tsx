import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CheckCircle2, Info, BookUp } from 'lucide-react';

interface Loan {
  id: number;
  bookTitle: string;
  author: string;
  loanDate: string;
  dueDate: string;
  status: 'active' | 'returned' | 'overdue';
  user: string;
}

const initialMockLoans: Loan[] = [
  { id: 1, bookTitle: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', loanDate: '2026-05-15', dueDate: '2026-06-15', status: 'active', user: 'Ana Pérez' },
  { id: 2, bookTitle: 'Cien años de soledad', author: 'Gabriel García Márquez', loanDate: '2026-04-10', dueDate: '2026-05-10', status: 'returned', user: 'Juan Gómez' },
  { id: 3, bookTitle: '1984', author: 'George Orwell', loanDate: '2026-05-20', dueDate: '2026-06-20', status: 'active', user: 'María López' },
  { id: 4, bookTitle: 'El Principito', author: 'Antoine de Saint-Exupéry', loanDate: '2026-03-01', dueDate: '2026-03-31', status: 'overdue', user: 'Carlos Díaz' },
];

export const LoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>(initialMockLoans);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);

  const getStatusBadge = useCallback((status: Loan['status']) => {
    switch (status) {
      case 'active':   return <Badge variant="primary">Activo</Badge>;
      case 'returned': return <Badge variant="secondary">Devuelto</Badge>;
      case 'overdue':  return <Badge variant="accent">Vencido</Badge>;
    }
  }, []);

  const loanStats = useMemo(() => {
    const active   = loans.filter((l) => l.status === 'active').length;
    const overdue  = loans.filter((l) => l.status === 'overdue').length;
    const returned = loans.filter((l) => l.status === 'returned').length;
    return { active, overdue, returned, total: loans.length };
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
      setLoans(prev => prev.map(l => l.id === selectedLoan.id ? { ...l, status: 'returned' } : l));
      setIsReturnModalOpen(false);
      setSelectedLoan(null);
    }
  };

  const confirmNewLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLoan: Loan = {
      id: Date.now(),
      bookTitle: formData.get('bookTitle') as string,
      author: 'Autor Desconocido',
      user: formData.get('user') as string,
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: formData.get('dueDate') as string,
      status: 'active'
    };
    setLoans([newLoan, ...loans]);
    setIsNewLoanModalOpen(false);
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
          <p className="text-2xl font-bold text-accent" aria-label={`${loanStats.overdue} préstamos vencidos`}>{loanStats.overdue}</p>
          <p className="text-xs text-secondary mt-1">Vencidos</p>
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
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{loan.bookTitle}</div>
                      <div className="text-xs text-secondary">{loan.author}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{loan.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{loan.loanDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{loan.dueDate}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isReturnModalOpen} onClose={() => setIsReturnModalOpen(false)} title="Confirmar Devolución">
        <div className="space-y-4">
          <p>¿Estás seguro de que deseas marcar el libro <strong>{selectedLoan?.bookTitle}</strong> como devuelto?</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsReturnModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={confirmReturn}>Confirmar</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detalle del Préstamo">
        {selectedLoan && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div><span className="font-semibold block text-gray-500">Libro:</span> {selectedLoan.bookTitle}</div>
              <div><span className="font-semibold block text-gray-500">Autor:</span> {selectedLoan.author}</div>
              <div><span className="font-semibold block text-gray-500">Usuario:</span> {selectedLoan.user}</div>
              <div><span className="font-semibold block text-gray-500">Estado:</span> {selectedLoan.status}</div>
              <div><span className="font-semibold block text-gray-500">Fecha de Préstamo:</span> {selectedLoan.loanDate}</div>
              <div><span className="font-semibold block text-gray-500">Fecha Límite:</span> {selectedLoan.dueDate}</div>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isNewLoanModalOpen} onClose={() => setIsNewLoanModalOpen(false)} title="Registrar Préstamo">
        <form onSubmit={confirmNewLoan} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Libro</label>
            <input required name="bookTitle" className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Título del libro..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Usuario</label>
            <input required name="user" className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Nombre del usuario..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Devolución</label>
            <input required type="date" name="dueDate" className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
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
