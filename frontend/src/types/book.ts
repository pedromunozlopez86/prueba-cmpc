export interface Book {
  id: string;
  title: string;
  author: string;
  editorial: string;
  price: number; // Precio en pesos chilenos (CLP) - entero sin decimales
  availability: boolean;
  genre: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  editorial: string;
  price: number;
  availability?: boolean;
  genre: string;
  description?: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface FilterBookDto {
  genre?: string;
  editorial?: string;
  author?: string;
  availability?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}
