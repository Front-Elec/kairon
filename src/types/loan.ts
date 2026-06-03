export interface Loan {
  id: string;
  bookId: string;
  userName: string;
  loanDate: string;
  returnDate?: string;
  status: "active" | "returned" | "cancelled";
}
