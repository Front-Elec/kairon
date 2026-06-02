import React, { useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const bookSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  author: z.string().min(1, 'El autor es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  isbn: z.string().regex(/^\d{3}-\d-\d{2}-\d{6}-\d$/, 'Formato ISBN inválido (ej: 000-0-00-000000-0)'),
  year: z.number().int().min(1000, 'Año inválido').max(new Date().getFullYear(), 'Año futuro inválido'),
  quantity: z.number().int().min(0, 'La cantidad no puede ser negativa'),
  description: z.string().optional()
});

export type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  initialData?: BookFormData;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<BookFormData>(initialData || {
    title: '', author: '', category: '', isbn: '', year: new Date().getFullYear(), quantity: 1, description: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    if (name === 'year' || name === 'quantity') {
      parsedValue = parseInt(value) || 0;
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    if (errors[name as keyof BookFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      bookSchema.parse(formData);
      onSubmit(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const flatErrors = err.flatten().fieldErrors as Record<string, string[] | undefined>;
        const fieldErrors: Partial<Record<keyof BookFormData, string>> = {};
        for (const key in flatErrors) {
          const messages = flatErrors[key];
          if (messages && messages.length > 0) {
            fieldErrors[key as keyof BookFormData] = messages[0];
          }
        }
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título del Libro</label>
          <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Rayuela" />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Autor</label>
          <Input name="author" value={formData.author} onChange={handleChange} placeholder="Ej: Julio Cortázar" />
          {errors.author && <p className="text-xs text-red-500">{errors.author}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoría</label>
          <Input name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Novela" />
          {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">ISBN</label>
          <Input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="000-0-00-000000-0" />
          {errors.isbn && <p className="text-xs text-red-500">{errors.isbn}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Año de Publicación</label>
          <Input type="number" name="year" value={formData.year} onChange={handleChange} />
          {errors.year && <p className="text-xs text-red-500">{errors.year}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cantidad</label>
          <Input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
          {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-secondary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px]"
          placeholder="Resumen del libro..."
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary" className="px-8">{initialData ? 'Guardar Cambios' : 'Registrar Libro'}</Button>
      </div>
    </form>
  );
};
