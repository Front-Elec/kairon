import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore } from '@/store/loansStore';
import { useStatsStore } from '@/store/statsStore';
import { BookOpen, BookUp, CheckCircle2, Users } from 'lucide-react';
import { useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export const StatsPage = () => {
  const books = useBooksStore((state) => state.books);
  const loans = useLoansStore((state) => state.loans);
  const stats = useStatsStore((state) => state.stats);
  const calculateStats = useStatsStore((state) => state.calculateStats);

  useEffect(() => {
    calculateStats();
  }, [books, loans, calculateStats]);

  const rawStats = [
    {
      label: 'Libros Totales',
      value: stats.totalBooks.toString(),
      trend: 'titulos registrados',
      icon: <BookOpen className="text-primary" size={24} />,
    },
    {
      label: 'Copias Disponibles',
      value: stats.availableBooks.toString(),
      trend: 'available acumulado',
      icon: <Users className="text-accent" size={24} />,
    },
    {
      label: 'Prestamos Activos',
      value: stats.activeLoans.toString(),
      trend: 'status active',
      icon: <BookUp className="text-blue-500" size={24} />,
    },
    {
      label: 'Prestamos Devueltos',
      value: stats.returnedLoans.toString(),
      trend: `${stats.returnRate}% retorno`,
      icon: <CheckCircle2 className="text-green-500" size={24} />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Estadisticas</h1>
        <p className="text-secondary mt-1">Metricas reales del estado global de la biblioteca.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rawStats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-3">
                <span className="p-2 bg-gray-50 rounded-lg">{stat.icon}</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full text-right">
                  {stat.trend}
                </span>
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
            <CardTitle>Distribucion por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.categoryDistribution}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={115} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow:
                      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stats.categoryDistribution.map((category) => (
                    <Cell key={category.name} fill={category.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Libros Populares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.popularBooks.slice(0, 5).map((book, index) => (
              <div
                key={book.id}
                className="flex items-center justify-between gap-4 border-b border-secondary/10 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {index + 1}. {book.title}
                  </p>
                  <p className="text-sm text-secondary truncate">{book.author}</p>
                </div>
                <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                  {book.popularity}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
