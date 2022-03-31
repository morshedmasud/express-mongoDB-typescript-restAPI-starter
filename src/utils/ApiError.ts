class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(
    statusCode: number,
    message: any,
    isOperational = true,
    stack: any
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
