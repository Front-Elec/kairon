import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BookForm, type BookFormData } from '@/components/BookForm';
import { BookPlus, FileDown, Users, AlertCircle } from 'lucide-react';

export const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookFormData | undefined>(undefined);

  const handleOpenCreateModal = () => {
    setEditingBook(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: BookFormData) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: BookFormData) => {
    console.log('Book data:', data);
    // Simulamos guardado de datos
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
          <p className="text-secondary mt-1">Gestiona el inventario de la biblioteca digital.</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <BookPlus size={18} />
          Añadir Libro
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventario (Demo Modal)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-secondary bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p>Usa los botones para probar el modal de creación y edición.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  <Button variant="secondary" onClick={() => handleOpenEditModal({
                    title: 'Rayuela', author: 'Julio Cortázar', category: 'Novela', isbn: '123-4-56-789012-3', year: 1963, quantity: 5, description: 'Contranovela de Julio Cortázar.'
                  })}>
                    Simular Editar "Rayuela"
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="secondary" className="w-full justify-start flex items-center gap-2">
                <FileDown size={18} /> Exportar Inventario (CSV)
              </Button>
              <Button variant="secondary" className="w-full justify-start flex items-center gap-2">
                <Users size={18} /> Ver Usuarios Activos
              </Button>
              <Button variant="secondary" className="w-full justify-start text-accent hover:bg-accent/10 flex items-center gap-2">
                <AlertCircle size={18} /> Reportar Incidencia
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <AlertCircle size={18} />
                Ayuda del Sistema
              </h4>
              <p className="text-xs text-secondary mt-2 leading-relaxed">
                Recuerda que todos los cambios en el inventario son registrados en el log de auditoría.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBook ? "Editar Libro" : "Registrar Nuevo Libro"}
      >
        <BookForm 
          initialData={editingBook} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};
