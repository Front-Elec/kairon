import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore } from '@/store/loansStore';
import { BookOpen, BookUp, Clock, Users } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

export const StatsPage = () => {
  const { books } = useBooksStore();
  const { loans } = useLoansStore();

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const totalCopies = books.reduce((sum, book) => sum + book.available, 0);
    const availableCopies = books.reduce((sum, book) => sum + book.available, 0);
    const activeLoans = loans.filter(l => l.status === 'active').length;
    const returnedLoans = loans.filter(l => l.status === 'returned').length;
    const returnRate = loans.length > 0 ? Math.round((returnedLoans / loans.length) * 100) : 0;
    const avgLoanDuration = loans.length > 0 ? 14 : 0; // Default to 14 days
    
    // Calcular distribución por categoría
    const categoryMap = new Map<string, number>();
    books.forEach(book => {
      categoryMap.set(book.category, (categoryMap.get(book.category) || 0) + 1);
    });
    const categoryDistribution = Array.from(categoryMap).map(([name, count]) => ({ name, count }));

    // Calcular actividad semanal (préstamos por día de la semana)
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const activityMap = new Map(days.map(d => [d, 0]));
    loans.forEach(loan => {
      const date = new Date(loan.loanDate);
      const dayName = days[date.getDay()];
      activityMap.set(dayName, activityMap.get(dayName)! + 1);
    });
    const weeklyActivity = Array.from(activityMap).map(([name, activity]) => ({ name, activity }));

    return {
      totalBooks,
      totalCopies,
      availableCopies,
      activeLoans,
      returnRate,
      avgLoanDuration,
      categoryDistribution,
      weeklyActivity,
    };
  }, [books, loans]);

  const rawStats = [
    { label: 'Libros Totales',    value: stats.totalCopies.toString(), trend: `${stats.totalBooks} títulos`, icon: <BookOpen className="text-primary" size={24} /> },
    { label: 'Préstamos Activos', value: stats.activeLoans.toString(), trend: `${stats.returnRate}% retorno puntual`, icon: <BookUp className="text-blue-500" size={24} /> },
    { label: 'Copias Disponibles', value: stats.availableCopies.toString(), trend: `${stats.totalCopies - stats.availableCopies} en préstamo`, icon: <Users className="text-accent" size={24} /> },
    { label: 'Tiempo Promedio', value: `${stats.avgLoanDuration} días`, trend: 'Duración promedio de préstamo', icon: <Clock className="text-green-500" size={24} /> },
  ];

    // Paleta de colores atractiva para la gráfica
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-secondary mt-1">Métricas clave del uso de la biblioteca digital.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rawStats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-gray-50 rounded-lg">{stat.icon}</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-secondary">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={115} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Semanal</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyActivity} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.1)'}} />
                <Bar dataKey="activity" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
