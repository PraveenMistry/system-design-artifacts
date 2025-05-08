interface Borrowing {
  borrowingId: string;
  memberId: string;
  bookIsbn: string;
  borrowDate: Date;
  returnDate?: Date;
  dueDate: Date;
  fineAmount?: number;
}
