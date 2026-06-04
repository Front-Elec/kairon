import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "../types/book";

interface BooksStore {
  books: Book[];

  addBook: (book: Book) => void;

  editBook: (
    id: string,
    updatedBook: Partial<Book>
  ) => void;

  deleteBook: (id: string) => void;
}

// Libros de ejemplo iniciales
const EXAMPLE_BOOKS: Book[] = [
  {
    id: "1",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    category: "Ficción",
    isbn: "978-84-322-0384-6",
    year: 1967,
    available: 3,
    createdAt: new Date().toISOString(),
    popularity: 95,
  },
  {
    id: "2",
    title: "Don Quijote",
    author: "Miguel de Cervantes",
    category: "Literatura Clásica",
    isbn: "978-84-213-6000-2",
    year: 1605,
    available: 2,
    createdAt: new Date().toISOString(),
    popularity: 92,
  },
  {
    id: "3",
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    category: "Infantil",
    isbn: "978-84-322-0584-0",
    year: 1943,
    available: 5,
    createdAt: new Date().toISOString(),
    popularity: 98,
  },
  {
    id: "4",
    title: "La casa de los espíritus",
    author: "Isabel Allende",
    category: "Ficción",
    isbn: "978-84-322-3884-9",
    year: 1982,
    available: 2,
    createdAt: new Date().toISOString(),
    popularity: 88,
  },
  {
    id: "5",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "No ficción",
    isbn: "978-84-376-0494-7",
    year: 2011,
    available: 4,
    createdAt: new Date().toISOString(),
    popularity: 89,
  },
  {
    id: "6",
    title: "El arte de la guerra",
    author: "Sun Tzu",
    category: "Filosofía",
    isbn: "978-84-323-0089-2",
    year: -500,
    available: 3,
    createdAt: new Date().toISOString(),
    popularity: 85,
  },
  {
    id: "7",
    title: "La revolución francesa",
    author: "Simon Schama",
    category: "Historia",
    isbn: "978-84-376-0150-2",
    year: 1989,
    available: 1,
    createdAt: new Date().toISOString(),
    popularity: 80,
  },
  {
    id: "8",
    title: "Programación en Python",
    author: "Guido van Rossum",
    category: "Tecnología",
    isbn: "978-84-415-3945-6",
    year: 2020,
    available: 6,
    createdAt: new Date().toISOString(),
    popularity: 91,
  },
];

export const useBooksStore =
  create<BooksStore>()(
    persist(
      (set) => ({
        books: EXAMPLE_BOOKS,

        addBook: (book) =>
          set((state) => ({
            books: [...state.books, book],
          })),

        editBook: (
          id,
          updatedBook
        ) =>
          set((state) => ({
            books: state.books.map((book) =>
              book.id === id
                ? {
                    ...book,
                    ...updatedBook,
                  }
                : book
            ),
          })),

        deleteBook: (id) =>
          set((state) => ({
            books: state.books.filter(
              (book) =>
                book.id !== id
            ),
          })),
      }),
      {
        name: "books-storage",
      }
    )
  );
