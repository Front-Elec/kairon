import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore } from '@/store/loansStore';

export const MyLoansPage = () => {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const books = useBooksStore((state) => state.books);
  const loans = useLoansStore((state) => state.loans);

  const myLoans = useMemo(() => {
    if (!session) {
      return [];
    }

    return loans.filter((loan) => loan.userName === session.username);
  }, [loans, session]);

  const activeLoans = myLoans.filter((loan) => loan.status === 'active').length;
  const returnedLoans = myLoans.filter((loan) => loan.status === 'returned').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Libros solicitados</h1>
          <p className="text-secondary text-lg">
            Revisa los libros que has solicitado y continúa explorando el catálogo.
          </p>
        </div>
        <Button type="button" onClick={() => navigate('/')}>
          Ir al catálogo
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Resumen de mis préstamos">
        <div className="rounded-xl border border-secondary/10 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-primary">{activeLoans}</p>
          <p className="mt-1 text-sm text-secondary">Préstamos activos</p>
        </div>
        <div className="rounded-xl border border-secondary/10 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-secondary">{returnedLoans}</p>
          <p className="mt-1 text-sm text-secondary">Préstamos devueltos</p>
        </div>
      </section>

      {myLoans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-secondary">
            Aún no tienes libros solicitados. Puedes pedir uno desde el catálogo cuando quieras.
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4">
          {myLoans.map((loan) => {
            const book = books.find((item) => item.id === loan.bookId);
            const loanDate = new Date(loan.loanDate);

            return (
              <Card key={loan.id}>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{book?.title || 'Libro no disponible'}</CardTitle>
                    <p className="text-sm text-secondary">{book?.author || 'Autor desconocido'}</p>
                  </div>
                  <Badge variant={loan.status === 'active' ? 'primary' : 'secondary'}>
                    {loan.status === 'active' ? 'Activo' : 'Devuelto'}
                  </Badge>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Fecha de préstamo</p>
                    <p className="mt-1 text-sm text-gray-700">{loanDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">ISBN</p>
                    <p className="mt-1 text-sm text-gray-700">{book?.isbn || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Disponibilidad actual</p>
                    <p className="mt-1 text-sm text-gray-700">
                      {book ? `${book.available} ejemplares disponibles` : 'Sin información'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </div>
  );
};
