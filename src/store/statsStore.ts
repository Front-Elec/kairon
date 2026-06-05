import { create } from 'zustand';
import type { Book } from '../types/book';
import { useBooksStore } from './booksStore';
import { useLoansStore } from './loansStore';

export interface StatsData {
  totalBooks: number;
  availableBooks: number;
  activeLoans: number;
  returnedLoans: number;
  popularBooks: Book[];
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

const categoryColors = [
  '#6366f1',
  '#60a5fa',
  '#f43f5e',
  '#4ade80',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

const emptyStats: StatsData = {
  totalBooks: 0,
  availableBooks: 0,
  activeLoans: 0,
  returnedLoans: 0,
  popularBooks: [],
  categoryDistribution: [],
  weeklyActivity: [],
  returnRate: 0,
  avgLoanDuration: 0,
};

const buildStats = (): StatsData => {
  const books = useBooksStore.getState().books;
  const loans = useLoansStore.getState().loans;

  const totalBooks = books.length;
  const availableBooks = books.reduce((sum, book) => sum + book.available, 0);
  const activeLoans = loans.filter((loan) => loan.status === 'active').length;
  const returnedLoans = loans.filter((loan) => loan.status === 'returned').length;
  const popularBooks = [...books].sort((a, b) => b.popularity - a.popularity);

  const categoryMap = new Map<string, number>();
  books.forEach((book) => {
    categoryMap.set(book.category, (categoryMap.get(book.category) || 0) + 1);
  });

  const categoryDistribution = Array.from(categoryMap.entries()).map(
    ([name, count], index) => ({
      name,
      count,
      fill: categoryColors[index % categoryColors.length],
    })
  );

  const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const activityMap = new Map(days.map((day) => [day, 0]));
  loans.forEach((loan) => {
    const dayName = days[new Date(loan.loanDate).getDay()];
    activityMap.set(dayName, (activityMap.get(dayName) || 0) + 1);
  });

  const weeklyActivity = Array.from(activityMap).map(([name, activity]) => ({
    name,
    activity,
  }));

  const returnRate = loans.length > 0
    ? Math.round((returnedLoans / loans.length) * 100)
    : 0;

  const returnedDurations = loans
    .filter((loan) => loan.returnDate)
    .map((loan) => {
      const loanDate = new Date(loan.loanDate);
      const returnDate = new Date(loan.returnDate!);
      return Math.floor(
        (returnDate.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    });

  const avgLoanDuration = returnedDurations.length > 0
    ? Math.round(
        returnedDurations.reduce((sum, daysOnLoan) => sum + daysOnLoan, 0) /
          returnedDurations.length
      )
    : 0;

  return {
    totalBooks,
    availableBooks,
    activeLoans,
    returnedLoans,
    popularBooks,
    categoryDistribution,
    weeklyActivity,
    returnRate,
    avgLoanDuration,
  };
};

export const useStatsStore = create<StatsStore>((set) => ({
  stats: emptyStats,

  calculateStats: () => {
    set({ stats: buildStats() });
  },

  getStats: () => {
    const stats = buildStats();
    set({ stats });
    return stats;
  },
}));
