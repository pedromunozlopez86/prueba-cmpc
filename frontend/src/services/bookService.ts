import api from "../lib/axios";
import type {
  ApiResponse,
  Book,
  CreateBookDto,
  FilterBookDto,
  PaginatedResponse,
  UpdateBookDto,
} from "../types/book";

export const bookService = {
  async getBooks(
    filters: FilterBookDto = {}
  ): Promise<PaginatedResponse<Book>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Book>>>(
      "/books",
      {
        params: filters,
      }
    );
    return response.data.data;
  },

  async getBook(id: string): Promise<Book> {
    const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data.data;
  },

  async createBook(data: CreateBookDto): Promise<Book> {
    const response = await api.post<ApiResponse<Book>>("/books", data);
    return response.data.data;
  },

  async updateBook(id: string, data: UpdateBookDto): Promise<Book> {
    const response = await api.patch<ApiResponse<Book>>(`/books/${id}`, data);
    return response.data.data;
  },

  async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  },

  async uploadImage(id: string, file: File): Promise<Book> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<ApiResponse<Book>>(
      `/books/${id}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  async exportToCsv(): Promise<Blob> {
    const response = await api.get("/books/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },

  async getStatistics(): Promise<any> {
    const response = await api.get<ApiResponse<any>>("/books/statistics");
    return response.data.data;
  },
};
