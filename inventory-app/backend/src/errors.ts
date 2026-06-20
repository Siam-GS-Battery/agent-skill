export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
export class ValidationError extends AppError { constructor(m: string) { super(400, m); } }
export class UnauthorizedError extends AppError { constructor(m = "Unauthorized") { super(401, m); } }
export class ForbiddenError extends AppError { constructor(m = "Forbidden") { super(403, m); } }
export class NotFoundError extends AppError { constructor(r: string) { super(404, `${r} not found`); } }
export class ConflictError extends AppError { constructor(m: string) { super(409, m); } }
