import { create } from 'zustand';

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  year: number;
  quantity: number;
  available: number;
  description?: string;
}

interface BookStore {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'available'>) => void;
  editBook: (id: number, book: Partial<Book>) => void;
  deleteBook: (id: number) => void;
  getBook: (id: number) => Book | undefined;
  decreaseAvailable: (id: number) => boolean;
  increaseAvailable: (id: number) => void;
}

// Datos iniciales
const initialBooks: Book[] = [
  { 
    id: 1, 
    title: 'Don Quijote de la Mancha', 
    author: 'Miguel de Cervantes', 
    category: 'Literatura', 
    isbn: '123-4-56-789012-3',
    year: 1605,
    quantity: 5,
    available: 3,
    description: 'La novela más famosa de la literatura española.'
  },
  { 
    id: 2, 
    title: 'Cien años de soledad', 
    author: 'Gabriel García Márquez', 
    category: 'Novela', 
    isbn: '456-7-89-012345-6',
    year: 1967,
    quantity: 3,
    available: 0,
    description: 'Un clásico de la literatura latinoamericana.'
  },
  { 
    id: 3, 
    title: 'El Principito', 
    author: 'Antoine de Saint-Exupéry', 
    category: 'Infantil', 
    isbn: '789-0-12-345678-9',
    year: 1943,
    quantity: 8,
    available: 7,
    description: 'Una fábula poética para todas las edades.'
  },
  { 
    id: 4, 
    title: '1984', 
    author: 'George Orwell', 
    category: 'Distopía', 
    isbn: '012-3-45-678901-2',
    year: 1949,
    quantity: 4,
    available: 2,
    description: 'Una novela de ficción distópica.'
  },
];

export const useBookStore = create<BookStore>((set, get) => ({
  books: initialBooks,

  addBook: (book) => {
    const { books } = get();
    const newBook: Book = {
      ...book,
      id: Math.max(...books.map(b => b.id), 0) + 1,
      available: book.quantity,
    };
    set({ books: [...books, newBook] });
  },

  editBook: (id, updates) => {
    set((state) => ({
      books: state.books.map((book) =>
        book.id === id ? { ...book, ...updates } : book
      ),
    }));
  },

  deleteBook: (id) => {
    set((state) => ({
      books: state.books.filter((book) => book.id !== id),
    }));
  },

  getBook: (id) => {
    return get().books.find((book) => book.id === id);
  },

  decreaseAvailable: (id) => {
    const book = get().getBook(id);
    if (!book || book.available <= 0) return false;
    
    get().editBook(id, { available: book.available - 1 });
    return true;
  },

  increaseAvailable: (id) => {
    const book = get().getBook(id);
    if (!book || book.available >= book.quantity) return;
    
    get().editBook(id, { available: book.available + 1 });
  },
}));
