// frontend/app/types/apiError.type.ts
export interface ApiError {
  message?: string;
  response?: {
    status?: number;
    _data?: {
      message?: string | Record<string, string[]>;
    };
  };
}
