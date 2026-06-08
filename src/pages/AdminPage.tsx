import { BookForm, type BookFormData } from '@/components/BookForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useBooksStore } from '@/store/booksStore';
import { useLoansStore } from '@/store/loansStore';
import { AlertCircle, BookPlus, FileSpreadsheet, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookFormData | undefined>(undefined);
  const [editingBookId, setEditingBookId] = useState<string | undefined>(undefined);
  const { books, addBook, editBook } = useBooksStore();
  const loans = useLoansStore((state) => state.loans);

  const activeUsers = Array.from(
    new Set(loans.filter((loan) => loan.status === 'active').map((loan) => loan.userName))
  );

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

  const buildInventoryMarkup = () => {
    const rows = books
      .map(
        (book) => `
          <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.isbn}</td>
            <td>${book.quantity}</td>
            <td>${book.available}</td>
          </tr>
        `
      )
      .join('');

    return `
      <table>
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Categoria</th>
            <th>ISBN</th>
            <th>Cantidad</th>
            <th>Disponible</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  };

  const handleExportExcel = () => {
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charSet="utf-8" />
          <style>
            table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
            th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
            th { background: #eff6ff; color: #1f2937; font-weight: 700; }
            caption { text-align: left; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <table>
            <caption>Inventario Karin</caption>
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Autor</th>
                <th>Categoria</th>
                <th>ISBN</th>
                <th>Cantidad</th>
                <th>Disponible</th>
              </tr>
            </thead>
            <tbody>
              ${books
                .map(
                  (book) => `
                    <tr>
                      <td>${book.title}</td>
                      <td>${book.author}</td>
                      <td>${book.category}</td>
                      <td>${book.isbn}</td>
                      <td>${book.quantity}</td>
                      <td>${book.available}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventario-karin.xls';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const printWindow = window.open('', '_blank', 'width=1024,height=768');

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Inventario Karin</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
            h1 { margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #eff6ff; }
            @page { size: A4 landscape; margin: 16mm; }
          </style>
        </head>
        <body>
          <h1>Inventario Karin</h1>
          ${buildInventoryMarkup()}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="max-w-none xl:max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
        <section className="space-y-6 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              {books.length === 0 ? (
                <div className="text-center py-12 text-secondary bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p>No hay libros registrados.</p>
                </div>
              ) : (
                <div className="-mx-6 overflow-x-auto px-6 pb-2">
                  <table className="min-w-[980px] w-full text-sm text-left">
                    <thead className="border-b border-secondary/10">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-secondary min-w-[260px]">Título</th>
                        <th className="px-4 py-3 font-semibold text-secondary min-w-[220px]">Autor</th>
                        <th className="px-4 py-3 font-semibold text-secondary min-w-[160px]">Categoría</th>
                        <th className="px-4 py-3 font-semibold text-secondary min-w-[180px]">ISBN</th>
                        <th className="px-4 py-3 font-semibold text-secondary min-w-[110px]">Cantidad</th>
                        <th className="px-4 py-3 font-semibold text-secondary min-w-[120px]">Disponible</th>
                        <th className="px-4 py-3 font-semibold text-secondary text-center min-w-[140px]">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/5">
                      {books.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium">{book.title}</td>
                          <td className="px-4 py-3 text-secondary">{book.author}</td>
                          <td className="px-4 py-3 text-secondary">{book.category}</td>
                          <td className="px-4 py-3 text-secondary">{book.isbn}</td>
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
              <Button variant="secondary" className="w-full justify-start flex items-center gap-2" onClick={handleExportExcel}>
                <FileSpreadsheet size={18} /> Exportar Inventario (Excel)
              </Button>
              <Button variant="secondary" className="w-full justify-start flex items-center gap-2" onClick={handleExportPdf}>
                <FileText size={18} /> Exportar Inventario (PDF)
              </Button>
              <Button variant="secondary" className="w-full justify-start flex items-center gap-2" onClick={() => setIsUsersModalOpen(true)}>
                <Users size={18} /> Ver Usuarios Activos
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

      <Modal
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
        title="Usuarios con préstamos activos"
      >
        <div className="space-y-4">
          {activeUsers.length === 0 ? (
            <p className="text-sm text-secondary">No hay usuarios con préstamos activos en este momento.</p>
          ) : (
            <ul className="space-y-2">
              {activeUsers.map((userName) => (
                <li key={userName} className="rounded-lg border border-secondary/10 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800">
                  {userName}
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setIsUsersModalOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
