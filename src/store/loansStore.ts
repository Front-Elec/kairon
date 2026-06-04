import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Loan } from "../types/loan";
import { useBooksStore } from "./booksStore";

interface LoansStore {
  loans: Loan[];

  createLoan: (loan: Loan) => void;

  returnLoan: (loanId: string) => void;

  cancelLoan: (loanId: string) => void;
}

// Préstamos de ejemplo iniciales
const EXAMPLE_LOANS: Loan[] = [
  {
    id: "loan-1",
    bookId: "1",
    userName: "Juan García",
    loanDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "loan-2",
    bookId: "3",
    userName: "María López",
    loanDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "loan-3",
    bookId: "2",
    userName: "Carlos Rodríguez",
    loanDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    returnDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "returned",
  },
];

export const useLoansStore = create<LoansStore>()(
  persist(
    (set) => ({
      loans: EXAMPLE_LOANS,

      createLoan: (loan) => {
        const { books, editBook } =
          useBooksStore.getState();

        const book = books.find(
          (b) => b.id === loan.bookId
        );

        if (book && book.available > 0) {
          editBook(book.id, {
            available: book.available - 1,
          });

          set((state) => ({
            loans: [...state.loans, loan],
          }));
        }
      },

      returnLoan: (loanId) => {
        const { loans } =
          useLoansStore.getState();

        const loan = loans.find(
          (l) => l.id === loanId
        );

        if (!loan) return;

        const { books, editBook } =
          useBooksStore.getState();

        const book = books.find(
          (b) => b.id === loan.bookId
        );

        if (book) {
          editBook(book.id, {
            available: book.available + 1,
          });
        }

        set((state) => ({
          loans: state.loans.map((l) =>
            l.id === loanId
              ? {
                  ...l,
                  status: "returned",
                  returnDate:
                    new Date().toISOString(),
                }
              : l
          ),
        }));
      },

      cancelLoan: (loanId) =>
        set((state) => ({
          loans: state.loans.filter(
            (loan) =>
              loan.id !== loanId
          ),
        })),
    }),
    {
      name: "loans-storage",
    }
  )
);
