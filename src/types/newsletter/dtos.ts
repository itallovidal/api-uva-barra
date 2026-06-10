export interface RegisterEmailRequestDTO {
  email: string;
}

export interface NewsletterEmailResponseDTO {
  id: string;
  email: string;
  createdAt: Date;
}

export interface CreateNewsletterRequestDTO {
  content: string;
}

export interface UpdateNewsletterRequestDTO {
  content: string;
}

export interface NewsletterResponseDTO {
  id: string;
  createdAt: Date;
  content: string;
}

export interface PaginatedEmailListDTO {
  data: NewsletterEmailResponseDTO[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
