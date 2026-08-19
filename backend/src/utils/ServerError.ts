export class ServerError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

// 400 Bad Request
export class BadRequestError extends ServerError {
  constructor(message: string) {
    super(message, 400);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ServerError {
  constructor(message: string) {
    super(message, 401);
  }
}

// 403 Forbidden
export class ForbiddenError extends ServerError {
  constructor(message: string) {
    super(message, 403);
  }
}

// 409 Conflict
export class ConflictError extends ServerError {
  constructor(message: string) {
    super(message, 409);
  }
}

// (Opcionális) 404 Not Found
export class NotFoundError extends ServerError {
  constructor(message: string) {
    super(message, 404);
  }
}
