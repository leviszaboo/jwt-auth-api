interface ConflictError extends Error {
  statusCode: number;
}

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export default ConflictError;
