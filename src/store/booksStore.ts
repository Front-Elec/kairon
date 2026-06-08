import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "../types/book";

const initialBooks: Book[] = [
  {
    id: "1",
    title: "Don Quijote de la Mancha",
    author: "Miguel de Cervantes",
    category: "Literatura",
    isbn: "978-84-204-1214-6",
    year: 1605,
    quantity: 5,
    available: 3,
    createdAt: "1605-01-01T00:00:00.000Z",
    popularity: 220,
  },
  {
    id: "2",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    category: "Novela",
    isbn: "978-84-376-0494-7",
    year: 1967,
    quantity: 2,
    available: 0,
    createdAt: "1967-05-30T00:00:00.000Z",
    popularity: 310,
  },
  {
    id: "3",
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    category: "Infantil",
    isbn: "978-84-206-7918-9",
    year: 1943,
    quantity: 6,
    available: 5,
    createdAt: "1943-04-06T00:00:00.000Z",
    popularity: 280,
  },
  {
    id: "4",
    title: "1984",
    author: "George Orwell",
    category: "Distopía",
    isbn: "978-84-663-2051-5",
    year: 1949,
    quantity: 3,
    available: 1,
    createdAt: "1949-06-08T00:00:00.000Z",
    popularity: 250,
  },
  {
    id: "5",
    title: "Rayuela",
    author: "Julio Cortázar",
    category: "Novela",
    isbn: "978-84-376-0495-4",
    year: 1963,
    quantity: 4,
    available: 0,
    createdAt: "1963-07-28T00:00:00.000Z",
    popularity: 190,
  },
  {
    id: "6",
    title: "Ficciones",
    author: "Jorge Luis Borges",
    category: "Cuento",
    isbn: "978-84-376-0496-1",
    year: 1944,
    quantity: 3,
    available: 2,
    createdAt: "1944-05-12T00:00:00.000Z",
    popularity: 170,
  },
  {
    id: "7",
    title: "El túnel",
    author: "Ernesto Sabato",
    category: "Novela",
    isbn: "978-84-376-0497-8",
    year: 1948,
    quantity: 5,
    available: 4,
    createdAt: "1948-04-05T00:00:00.000Z",
    popularity: 140,
  },
  {
    id: "8",
    title: "Sobre héroes y tumbas",
    author: "Ernesto Sabato",
    category: "Novela",
    isbn: "978-84-376-0498-5",
    year: 1961,
    quantity: 3,
    available: 0,
    createdAt: "1961-10-01T00:00:00.000Z",
    popularity: 160,
  },
];

interface BooksStore {
  books: Book[];

  addBook: (book: Book) => void;

  editBook: (
    id: string,
    updatedBook: Partial<Book>
  ) => void;

  deleteBook: (id: string) => void;

  isIsbnDuplicate: (isbn: string, exclusionId?: string) => boolean;
}

export const useBooksStore =
  create<BooksStore>()(
    persist(
      (set, get) => ({
        books: initialBooks,

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

        isIsbnDuplicate: (isbn, exclusionId) => {
          const normalizedIsbn = isbn.replace(/[-\s]/g, "").toLowerCase();

          return get().books.some((book) => {
            const bookIsbn = book.isbn.replace(/[-\s]/g, "").toLowerCase();

            if (exclusionId && book.id === exclusionId) {
              return false;
            }

            return bookIsbn === normalizedIsbn;
          });
        },
      }),
      {
        name: "books-storage",
      }
    )
  );
