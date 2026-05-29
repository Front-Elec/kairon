import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
  const getStatusBadge = (status: Loan['status']) => {
    switch (status) {
      case 'active': return <Badge variant="primary">Activo</Badge>;
      case 'returned': return <Badge variant="secondary">Devuelto</Badge>;
      case 'overdue': return <Badge variant="accent">Vencido</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Mis Préstamos</h1>
        <p className="text-secondary mt-1">Historial y estado actual de tus libros solicitados.</p>
      </header>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-secondary/10 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Libro</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider hidden md:table-cell">Fecha Préstamo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Fecha Devolución</th>
                  <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Estado</th>
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
