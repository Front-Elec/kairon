import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const StatsPage = () => {
  const stats = [
    { label: 'Libros Totales', value: '1,284', trend: '+12 este mes', icon: '📚' },
    { label: 'Préstamos Activos', value: '45', trend: '85% retorno puntual', icon: '📖' },
    { label: 'Nuevos Usuarios', value: '156', trend: '+22% vs mes anterior', icon: '👤' },
    { label: 'Tiempo Promedio', value: '12 días', trend: '-2 días vs 2025', icon: '⏱️' },
  ];

  const categories = [
    { name: 'Literatura', count: 450, color: 'bg-primary' },
    { name: 'Ciencia', count: 320, color: 'bg-blue-400' },
    { name: 'Historia', count: 210, color: 'bg-accent' },
    { name: 'Tecnología', count: 180, color: 'bg-green-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-secondary mt-1">Métricas clave del uso de la biblioteca digital.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <span className="text-2xl">{stat.icon}</span>
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
          <CardContent>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-secondary">{cat.count} libros</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.color} rounded-full transition-all duration-1000`} 
                      style={{ width: `${(cat.count / 500) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Actividad Semanal</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-end justify-between gap-2 pt-4">
            {[45, 60, 35, 80, 55, 70, 40].map((height, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group">
                <div 
                  className="bg-primary group-hover:bg-blue-700 transition-all rounded-t-sm" 
                  style={{ height: `${height}%` }}
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-secondary font-medium">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
