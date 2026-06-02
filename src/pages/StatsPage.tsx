import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BookOpen, BookUp, Users, Clock } from 'lucide-react';

const rawStats = [
  { label: 'Libros Totales',    value: '1,284', trend: '+12 este mes',          icon: <BookOpen className="text-primary" size={24} /> },
  { label: 'Préstamos Activos', value: '45',    trend: '85% retorno puntual',   icon: <BookUp className="text-blue-500" size={24} /> },
  { label: 'Nuevos Usuarios',   value: '156',   trend: '+22% vs mes anterior',  icon: <Users className="text-accent" size={24} /> },
  { label: 'Tiempo Promedio',   value: '12 días', trend: '-2 días vs 2025',     icon: <Clock className="text-green-500" size={24} /> },
];

const categoryData = [
  { name: 'Literatura', count: 450, fill: '#6366f1' },
  { name: 'Ciencia',    count: 320, fill: '#60a5fa' },
  { name: 'Historia',   count: 210, fill: '#f43f5e' },
  { name: 'Tecnología', count: 180, fill: '#4ade80' },
];

const weeklyData = [
  { name: 'L', activity: 45 },
  { name: 'M', activity: 60 },
  { name: 'X', activity: 35 },
  { name: 'J', activity: 80 },
  { name: 'V', activity: 55 },
  { name: 'S', activity: 70 },
  { name: 'D', activity: 40 },
];

export const StatsPage = () => {
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
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} />
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
              <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
