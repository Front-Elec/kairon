import { create } from 'zustand';
import { useBookStore } from './bookStore';
import { useLoanStore } from './loanStore';

export interface StatsData {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  activeLoans: number;
  returnedLoans: number;
  overdueLoans: number;
  categoryDistribution: Array<{ name: string; count: number; fill: string }>;
  weeklyActivity: Array<{ name: string; activity: number }>;
  returnRate: number;
  avgLoanDuration: number;
}

interface StatsStore {
  stats: StatsData;
  calculateStats: () => void;
  getStats: () => StatsData;
}

const categoryColors: Record<string, string> = {
  'Literatura': '#6366f1',
  'Novela': '#60a5fa',
  'Infantil': '#f43f5e',
  'Distopía': '#4ade80',
  'Historia': '#f59e0b',
  'Ciencia': '#8b5cf6',
  'Tecnología': '#ec4899',
};

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: {
    totalBooks: 0,
    totalCopies: 0,
    availableCopies: 0,
    activeLoans: 0,
    returnedLoans: 0,
    overdueLoans: 0,
    categoryDistribution: [],
    weeklyActivity: [],
    returnRate: 0,
    avgLoanDuration: 0,
  },

  calculateStats: () => {
    const books = useBookStore.getState().books;
    const loans = useLoanStore.getState().loans;

    // Estadísticas básicas
    const totalBooks = books.length;
    const totalCopies = books.reduce((sum, book) => sum + book.quantity, 0);
    const availableCopies = books.reduce((sum, book) => sum + book.available, 0);

    // Estadísticas de préstamos
    const activeLoans = loans.filter(l => l.status === 'active').length;
    const returnedLoans = loans.filter(l => l.status === 'returned').length;
    const overdueLoans = loans.filter(l => l.status === 'overdue').length;

    // Distribución por categoría
    const categoryMap = new Map<string, number>();
    books.forEach((book) => {
      categoryMap.set(book.category, (categoryMap.get(book.category) || 0) + book.quantity);
    });

    const categoryDistribution = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
      fill: categoryColors[name] || '#6366f1',
    }));

    // Actividad semanal (simulado - en realidad usaría timestamps)
    const weeklyActivity = [
      { name: 'L', activity: Math.floor(Math.random() * 100) + 20 },
      { name: 'M', activity: Math.floor(Math.random() * 100) + 20 },
      { name: 'X', activity: Math.floor(Math.random() * 100) + 20 },
      { name: 'J', activity: Math.floor(Math.random() * 100) + 20 },
      { name: 'V', activity: Math.floor(Math.random() * 100) + 20 },
      { name: 'S', activity: Math.floor(Math.random() * 100) + 20 },
      { name: 'D', activity: Math.floor(Math.random() * 100) + 20 },
    ];

    // Tasa de retorno
    const totalLoansProcessed = returnedLoans + overdueLoans;
    const returnRate = totalLoansProcessed > 0 
      ? Math.round((returnedLoans / totalLoansProcessed) * 100) 
      : 0;

    // Duración promedio de préstamos
    let totalDays = 0;
    let completedLoans = 0;
    loans.forEach((loan) => {
      if (loan.returnDate) {
        const loanDate = new Date(loan.loanDate);
        const returnDate = new Date(loan.returnDate);
        const days = Math.floor((returnDate.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += days;
        completedLoans++;
      }
    });
    const avgLoanDuration = completedLoans > 0 ? Math.round(totalDays / completedLoans) : 0;

    const stats: StatsData = {
      totalBooks,
      totalCopies,
      availableCopies,
      activeLoans,
      returnedLoans,
      overdueLoans,
      categoryDistribution,
      weeklyActivity,
      returnRate,
      avgLoanDuration,
    };

    set({ stats });
  },

  getStats: () => {
    get().calculateStats();
    return get().stats;
  },
}));
