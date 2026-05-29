import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const CatalogPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Catálogo de Libros</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Libro de Ejemplo {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary text-sm">Explora las maravillas de la literatura digital con este título de ejemplo.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
