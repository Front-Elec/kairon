import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const AdminPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
        <p className="text-secondary mt-1">Gestiona el inventario de la biblioteca digital.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Añadir Nuevo Libro</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título del Libro</label>
                    <Input placeholder="Ej: Rayuela" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Autor</label>
                    <Input placeholder="Ej: Julio Cortázar" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ISBN</label>
                    <Input placeholder="000-0-00-000000-0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <Input placeholder="Ej: Novela" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px]"
                    placeholder="Resumen del libro..."
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button variant="primary" className="px-8">Guardar Libro</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">Exportar Inventario (CSV)</Button>
              <Button variant="secondary" className="w-full justify-start">Ver Usuarios Activos</Button>
              <Button variant="secondary" className="w-full justify-start text-accent hover:bg-accent/10">Reportar Incidencia</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary">Ayuda del Sistema</h4>
              <p className="text-xs text-secondary mt-2 leading-relaxed">
                Recuerda que todos los cambios en el inventario son registrados en el log de auditoría.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
