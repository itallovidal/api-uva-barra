export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "CONFLICT";

export interface AppError {
  message: string;
  code: ErrorCode;
}

export interface Meta {
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
}

export interface ResponsePayload<T = unknown> {
  status: number;
  data?: T;
  error?: AppError;
  meta?: Meta;
}
