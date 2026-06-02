import { useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Loan {
  id: number;
  bookTitle: string;
  author: string;
  loanDate: string;
  dueDate: string;
  status: 'active' | 'returned' | 'overdue';
}

const mockLoans: Loan[] = [
  { id: 1, bookTitle: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', loanDate: '2026-05-15', dueDate: '2026-06-15', status: 'active' },
  { id: 2, bookTitle: 'Cien años de soledad', author: 'Gabriel García Márquez', loanDate: '2026-04-10', dueDate: '2026-05-10', status: 'returned' },
  { id: 3, bookTitle: '1984', author: 'George Orwell', loanDate: '2026-05-20', dueDate: '2026-06-20', status: 'active' },
  { id: 4, bookTitle: 'El Principito', author: 'Antoine de Saint-Exupéry', loanDate: '2026-03-01', dueDate: '2026-03-31', status: 'overdue' },
];

export const LoansPage = () => {
  /**
   * useCallback: getStatusBadge es un helper que se pasa implícitamente
   * al renderizar cada fila. Al envolverlo en useCallback, React garantiza
   * que la referencia de la función sea estable entre renders, evitando
   * que filas memoizadas se re-rendericen sin necesidad.
   */
  const getStatusBadge = useCallback((status: Loan['status']) => {
    switch (status) {
      case 'active':   return <Badge variant="primary">Activo</Badge>;
      case 'returned': return <Badge variant="secondary">Devuelto</Badge>;
      case 'overdue':  return <Badge variant="accent">Vencido</Badge>;
    }
  }, []);

  /**
   * useMemo: calcula el resumen de estadísticas derivadas de mockLoans
   * una sola vez. Si la lista no cambia, este cálculo no se repite
   * aunque el componente se re-renderice por causas externas.
   */
  const loanStats = useMemo(() => {
    const active   = mockLoans.filter((l) => l.status === 'active').length;
    const overdue  = mockLoans.filter((l) => l.status === 'overdue').length;
    const returned = mockLoans.filter((l) => l.status === 'returned').length;
    return { active, overdue, returned, total: mockLoans.length };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Mis Préstamos</h1>
        <p className="text-secondary mt-1">Historial y estado actual de tus libros solicitados.</p>
      </header>

      {/* Resumen derivado con useMemo */}
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
          <div className="overflow-x-auto">
            {/* scope="col" en th mejora accesibilidad de tablas (Lighthouse Accessibility) */}
            <table className="w-full text-left border-collapse" aria-label="Tabla de préstamos">
              <thead>
                <tr className="border-b border-secondary/10 bg-gray-50/50">
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Libro</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider hidden md:table-cell">Fecha Préstamo</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Fecha Devolución</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/5">
                {mockLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{loan.bookTitle}</div>
                      <div className="text-xs text-secondary">{loan.author}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{loan.loanDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{loan.dueDate}</td>
                    <td className="px-6 py-4 text-right">
                      {getStatusBadge(loan.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
