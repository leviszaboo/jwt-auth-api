interface InternalServerError extends Error {
  statusCode: number;
}

class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

export default InternalServerError;
