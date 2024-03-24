interface InternalServerError extends Error {
  statusCode: number;
  errorCode: string;
}

class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
    this.errorCode = "INTERNAL_SERVER_ERROR";
  }
}

export default InternalServerError;
