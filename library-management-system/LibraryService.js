class LibraryService {
  constructor(private readonly libraryRepository: LibraryRepository) {}

  async addLibrary(library: Library): Promise<void> {
    await this.libraryRepository.add(library);
  }

  async updateLibrary(library: Library): Promise<void> {
    await this.libraryRepository.update(library);
  }

  async deleteLibrary(libraryId: string): Promise<void> {
    await this.libraryRepository.delete(libraryId);
  }

  async getLibrary(libraryId: string): Promise<Library | null> {
    return this.libraryRepository.getById(libraryId);
  }

  async getAllLibraries(): Promise<Library[]> {
    return this.libraryRepository.getAll();
  }
}
