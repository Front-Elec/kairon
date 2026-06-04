import { create } from 'zustand';

export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  author: string;
  user: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

interface LoanStore {
  loans: Loan[];
  createLoan: (bookId: number, user: string, daysToReturn: number) => boolean;
  returnLoan: (loanId: number) => void;
  getLoan: (id: number) => Loan | undefined;
  getLoansByStatus: (status: Loan['status']) => Loan[];
  getActiveLoansByBook: (bookId: number) => number;
}

const initialLoans: Loan[] = [
  { 
    id: 1, 
    bookId: 1, 
    bookTitle: 'Don Quijote de la Mancha', 
    author: 'Miguel de Cervantes',
    user: 'Ana Pérez', 
    loanDate: '2026-05-15', 
    dueDate: '2026-06-15', 
    status: 'active' 
  },
  { 
    id: 2, 
    bookId: 2, 
    bookTitle: 'Cien años de soledad', 
    author: 'Gabriel García Márquez',
    user: 'Juan Gómez', 
    loanDate: '2026-04-10', 
    dueDate: '2026-05-10', 
    returnDate: '2026-05-09',
    status: 'returned' 
  },
  { 
    id: 3, 
    bookId: 4, 
    bookTitle: '1984', 
    author: 'George Orwell',
    user: 'María López', 
    loanDate: '2026-05-20', 
    dueDate: '2026-06-20', 
    status: 'active' 
  },
  { 
    id: 4, 
    bookId: 1, 
    bookTitle: 'Don Quijote de la Mancha', 
    author: 'Miguel de Cervantes',
    user: 'Carlos Díaz', 
    loanDate: '2026-03-01', 
    dueDate: '2026-03-31', 
    status: 'overdue' 
  },
];

export const useLoanStore = create<LoanStore>((set, get) => ({
  loans: initialLoans,

  createLoan: (bookId, user, daysToReturn) => {
    const { loans } = get();
    const today = new Date();
    const dueDate = new Date(today.getTime() + daysToReturn * 24 * 60 * 60 * 1000);
    
    // Obtenemos un libro dummy, el libro real se obtiene desde el componente
    const newLoan: Loan = {
      id: Math.max(...loans.map(l => l.id), 0) + 1,
      bookId,
      bookTitle: `Libro ${bookId}`,
      author: 'Autor',
      user,
      loanDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'active',
    };

    set({ loans: [...loans, newLoan] });
    return true;
  },

  returnLoan: (loanId) => {
    set((state) => ({
      loans: state.loans.map((loan) =>
        loan.id === loanId 
          ? { 
              ...loan, 
              status: 'returned',
              returnDate: new Date().toISOString().split('T')[0]
            } 
          : loan
      ),
    }));
  },

  getLoan: (id) => {
    return get().loans.find((loan) => loan.id === id);
  },

  getLoansByStatus: (status) => {
    return get().loans.filter((loan) => loan.status === status);
  },

  getActiveLoansByBook: (bookId) => {
    return get().loans.filter(
      (loan) => loan.bookId === bookId && loan.status === 'active'
    ).length;
  },
}));
