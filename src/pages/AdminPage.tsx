import { BookForm, type BookFormData } from '@/components/BookForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useBooksStore } from '@/store/booksStore';
import { AlertCircle, BookPlus, FileDown, Users } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookFormData | undefined>(undefined);
  const [editingBookId, setEditingBookId] = useState<string | undefined>(undefined);
  const { books, addBook, editBook } = useBooksStore();

  const handleOpenCreateModal = () => {
    setEditingBook(undefined);
    setEditingBookId(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book: BookFormData, id: string) => {
    setEditingBook(book);
    setEditingBookId(id);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: BookFormData) => {
    if (editingBookId !== undefined) {
      // Modo edición
      editBook(editingBookId, data);
    } else {
      // Modo creación - generar ID único
      const newBook = {
        id: uuidv4().toString(),
        ...data,
        available: data.quantity || 0,
        createdAt: new Date().toISOString(),
        popularity: 0,
      };
      addBook(newBook);
    }
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
              <CardTitle>Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              {books.length === 0 ? (
                <div className="text-center py-12 text-secondary bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p>No hay libros registrados.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="border-b border-secondary/10">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-secondary">Título</th>
                        <th className="px-4 py-3 font-semibold text-secondary">Autor</th>
                        <th className="px-4 py-3 font-semibold text-secondary">Categoría</th>
                        <th className="px-4 py-3 font-semibold text-secondary">Cantidad</th>
                        <th className="px-4 py-3 font-semibold text-secondary">Disponible</th>
                        <th className="px-4 py-3 font-semibold text-secondary text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/5">
                      {books.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium">{book.title}</td>
                          <td className="px-4 py-3 text-secondary">{book.author}</td>
                          <td className="px-4 py-3 text-secondary">{book.category}</td>
                          <td className="px-4 py-3">{book.quantity}</td>
                          <td className="px-4 py-3">{book.available}</td>
                          <td className="px-4 py-3 text-center">
                            <Button 
                              variant="secondary" 
                              className="text-xs py-1 px-2"
                              onClick={() => handleOpenEditModal(book as BookFormData, book.id)}
                            >
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
          editingId={editingBookId}
          onSubmit={handleFormSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};
