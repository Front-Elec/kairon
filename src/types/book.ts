export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  year: number;
  quantity: number;
  available: number;
  createdAt: string;
  popularity: number;
  description?: string;
}
