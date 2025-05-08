class LibrarianService {
  constructor(private readonly librarianRepository: LibrarianRepository) {}

  async addLibrarian(librarian: Librarian): Promise<void> {
    await this.librarianRepository.add(librarian);
  }

  async updateLibrarian(librarian: Librarian): Promise<void> {
    await this.librarianRepository.update(librarian);
  }

  async deleteLibrarian(librarianId: string): Promise<void> {
    await this.librarianRepository.delete(librarianId);
  }

  async getLibrarian(librarianId: string): Promise<Librarian | null> {
    return this.librarianRepository.getById(librarianId);
  }

  async getAllLibrarians(): Promise<Librarian[]> {
    return this.librarianRepository.getAll();
  }
}
