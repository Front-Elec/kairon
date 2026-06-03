import { useMemo } from "react";
import type { Book } from "../types/book";

export type AvailabilityFilter = "all" | "available" | "unavailable";
export type BookSortOption = "az" | "date" | "popularity";

interface UseBookSearchParams {
  books: Book[];
  searchText: string;
  category: string;
  availability: AvailabilityFilter;
  sortBy: BookSortOption;
}

export const useBookSearch = ({
  books,
  searchText,
  category,
  availability,
  sortBy,
}: UseBookSearchParams): Book[] => {
  return useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    const normalizedCategory = category.trim().toLowerCase();

    return books
      .filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(normalizedSearch) ||
          book.author.toLowerCase().includes(normalizedSearch);

        const matchesCategory =
          normalizedCategory === "" ||
          normalizedCategory === "all" ||
          book.category.toLowerCase() === normalizedCategory;

        const matchesAvailability =
          availability === "all" ||
          (availability === "available" && book.available > 0) ||
          (availability === "unavailable" && book.available === 0);

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === "az") {
          return a.title.localeCompare(b.title);
        }

        if (sortBy === "date") {
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        }

        if (sortBy === "popularity") {
          return b.popularity - a.popularity;
        }

        return 0;
      });
  }, [books, searchText, category, availability, sortBy]);
};
