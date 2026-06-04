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
    quantity: 5,
    available: 3,
    createdAt: new Date().toISOString(),
    popularity: 95,
    description: "La obra cumbre del realismo mágico narra la historia de la familia Buendía a lo largo de siete generaciones en el ficticio pueblo de Macondo, fusionando lo fantástico con lo cotidiano.",
  },
  {
    id: "2",
    title: "Don Quijote",
    author: "Miguel de Cervantes",
    category: "Literatura Clásica",
    isbn: "978-84-213-6000-2",
    year: 1605,
    quantity: 4,
    available: 2,
    createdAt: new Date().toISOString(),
    popularity: 92,
    description: "Considerada la primera novela moderna, narra las aventuras de un hidalgo empobrecido que pierde la razón por leer libros de caballerías y decide recorrer España montado en su caballo Rocinante.",
  },
  {
    id: "3",
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    category: "Infantil",
    isbn: "978-84-322-0584-0",
    year: 1943,
    quantity: 8,
    available: 5,
    createdAt: new Date().toISOString(),
    popularity: 98,
    description: "Una fábula poética y filosófica que, bajo la apariencia de un libro infantil, aborda temas profundos como la amistad, el amor, la pérdida y la naturaleza humana desde la perspectiva de un pequeño príncipe de otro planeta.",
  },
  {
    id: "4",
    title: "La casa de los espíritus",
    author: "Isabel Allende",
    category: "Ficción",
    isbn: "978-84-322-3884-9",
    year: 1982,
    quantity: 3,
    available: 2,
    createdAt: new Date().toISOString(),
    popularity: 88,
    description: "Una monumental saga familiar ambientada en un país latinoamericano anónimo, que sigue la vida de la familia Trueba a lo largo de cuatro generaciones marcadas por pasiones, conflictos políticos y el misticismo.",
  },
  {
    id: "5",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "No ficción",
    isbn: "978-84-376-0494-7",
    year: 2011,
    quantity: 5,
    available: 4,
    createdAt: new Date().toISOString(),
    popularity: 89,
    description: "Una reveladora travesía por la historia de la humanidad, desde la aparición de los primeros homínidos en la Tierra hasta las revoluciones cognitiva, agrícola y científica que definen nuestra sociedad actual.",
  },
  {
    id: "6",
    title: "El arte de la guerra",
    author: "Sun Tzu",
    category: "Filosofía",
    isbn: "978-84-323-0089-2",
    year: -500,
    quantity: 3,
    available: 3,
    createdAt: new Date().toISOString(),
    popularity: 85,
    description: "El tratado militar más influyente de la historia, cuyas lecciones sobre estrategia, táctica y resolución de conflictos se aplican hoy tanto en el ámbito de la defensa como en los negocios y el crecimiento personal.",
  },
  {
    id: "7",
    title: "La revolución francesa",
    author: "Simon Schama",
    category: "Historia",
    isbn: "978-84-376-0150-2",
    year: 1989,
    quantity: 2,
    available: 1,
    createdAt: new Date().toISOString(),
    popularity: 80,
    description: "Un detallado y narrativo estudio histórico sobre las causas, el desarrollo violento y las profundas consecuencias sociales y políticas de la Revolución Francesa, desmontando varios mitos históricos del período.",
  },
  {
    id: "8",
    title: "Programación en Python",
    author: "Guido van Rossum",
    category: "Tecnología",
    isbn: "978-84-415-3945-6",
    year: 2020,
    quantity: 10,
    available: 6,
    createdAt: new Date().toISOString(),
    popularity: 91,
    description: "Una completa guía introductoria al lenguaje de programación más versátil y demandado del mundo, escrita con un enfoque práctico para aprender desde la sintaxis básica hasta conceptos avanzados de desarrollo.",
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
