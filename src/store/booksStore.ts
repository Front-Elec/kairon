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

export const useBooksStore =
  create<BooksStore>()(
    persist(
      (set) => ({
        books: [],

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
