import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const rawStats = [
  { label: 'Libros Totales',    value: '1,284', trend: '+12 este mes',          icon: '📚' },
  { label: 'Préstamos Activos', value: '45',    trend: '85% retorno puntual',   icon: '📖' },
  { label: 'Nuevos Usuarios',   value: '156',   trend: '+22% vs mes anterior',  icon: '👤' },
  { label: 'Tiempo Promedio',   value: '12 días', trend: '-2 días vs 2025',     icon: '⏱️' },
];

const rawCategories = [
  { name: 'Literatura',  count: 450, color: 'bg-primary'    },
  { name: 'Ciencia',     count: 320, color: 'bg-blue-400'   },
  { name: 'Historia',    count: 210, color: 'bg-accent'     },
  { name: 'Tecnología',  count: 180, color: 'bg-green-400'  },
];

const WEEKLY_ACTIVITY = [45, 60, 35, 80, 55, 70, 40];
const WEEK_LABELS     = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MAX_CATEGORY    = 500;

export const StatsPage = () => {
  /**
   * useMemo: calcula el porcentaje de ancho de cada barra de categoría
   * a partir de rawCategories. Este cálculo solo se repite si rawCategories
   * cambiara; mientras sea constante se reutiliza el resultado memoizado.
   */
  const categoriesWithPercent = useMemo(
    () =>
      rawCategories.map((cat) => ({
        ...cat,
        percent: Math.round((cat.count / MAX_CATEGORY) * 100),
      })),
    [] // rawCategories es constante fuera del componente
  );

  /**
   * useMemo: normaliza la actividad semanal calculando la altura
   * relativa de cada barra en porcentaje respecto al valor máximo.
   * Evita recalcular en cada render si los datos no cambian.
   */
  const weeklyBars = useMemo(() => {
    const max = Math.max(...WEEKLY_ACTIVITY);
    return WEEKLY_ACTIVITY.map((value, i) => ({
      label:   WEEK_LABELS[i],
      percent: Math.round((value / max) * 100),
    }));
  }, []); // WEEKLY_ACTIVITY es constante

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
        {/* Barras de categoría con porcentajes calculados por useMemo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoriesWithPercent.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-secondary">{cat.count} libros</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfica de actividad semanal con alturas normalizadas por useMemo */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Actividad Semanal</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-end justify-between gap-2 pt-4">
            {weeklyBars.map((bar, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group flex flex-col justify-end h-full">
                <div
                  className="bg-primary group-hover:bg-blue-700 transition-all rounded-t-sm"
                  style={{ height: `${bar.percent}%` }}
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-secondary font-medium">
                  {bar.label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
