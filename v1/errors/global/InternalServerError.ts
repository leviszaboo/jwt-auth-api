interface InternalServerError extends Error {
  statusCode: number;
  code: string;
}

class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
    this.code = "INTERNAL_SERVER_ERROR";
  }
}

export default InternalServerError;
