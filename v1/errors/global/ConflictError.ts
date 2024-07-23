interface ConflictError extends Error {
  statusCode: number;
}

class ConflictError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;

    Object.setPrototypeOf(this, ConflictError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConflictError);
    }
  }
}

export default ConflictError;
