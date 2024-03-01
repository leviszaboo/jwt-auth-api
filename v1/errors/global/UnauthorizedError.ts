interface UnauthorizedError extends Error {
  statusCode: number;
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
