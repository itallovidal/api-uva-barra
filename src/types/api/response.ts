export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "CONFLICT"
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_PAYLOAD"
  | "USER_NOT_FOUND"
  | "USER_CREATION_ERROR"
  | "RESPONSE_PARSE_ERROR";

export interface ErrorPayload {
  message: string;
  code: string;
}

export interface MetaApiPayload {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export type Meta = MetaApiPayload;

export interface ResponsePayload<T = unknown> {
  status: number;
  data?: T;
  error?: ErrorPayload;
  meta?: MetaApiPayload;
}
