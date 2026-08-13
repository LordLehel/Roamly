export interface ApiResponse<T> {
  status: number;
  data: T;
}

export interface LoginResponse {
  status: string;
  message: string;
  token?: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
}

export interface ErrorDetail {
  message?: string;
}

export interface ApiErrorResponse {
  data?: {
    status?: string;
    message?: string | Record<string, string[]>;
  };
  message?: string;
}
