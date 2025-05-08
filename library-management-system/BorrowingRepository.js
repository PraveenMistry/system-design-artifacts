interface BorrowingRepository {
  borrowBook(borrowing: Borrowing): Promise<void>;
  returnBook(borrowingId: string, returnDate: Date): Promise<void>;
  getById(borrowingId: string): Promise<Borrowing | null>;
  getCurrentBorrowingsByMember(memberId: string): Promise<Borrowing[]>;
  getOverdueBorrowings(): Promise<Borrowing[]>;
}
