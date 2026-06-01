export const API_ERROR_CODES = {
  Api: {
    InvalidPayloadError: "INVALID_PAYLOAD",
    NotFound: "API_NOT_FOUND",
    InternalServerError: "INTERNAL_SERVER_ERROR",
    InvalidCredentialsError: "INVALID_CREDENTIALS",
    ResponseParseError: "RESPONSE_PARSE_ERROR",
    UnknownError: "UNKNOWN_ERROR",
  },
  User: {
    NotFound: "USER_NOT_FOUND",
    InvalidCredentials: "INVALID_CREDENTIALS",
    CreationError: "USER_CREATION_ERROR",
    EmailAlreadyExists: "EMAIL_ALREADY_EXISTS",
  },
} as const;

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
