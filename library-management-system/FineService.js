class FineService {
  calculateFine(dueDate: Date, returnDate: Date, finePerDay: number): number {
    if (returnDate > dueDate) {
      const timeDiff = returnDate.getTime() - dueDate.getTime();
      const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysLate * finePerDay;
    }
    return 0;
  }
}
