import UnauthorizedError from "../global/UnauthorizedError";

interface IncorrectPasswordError extends UnauthorizedError {
  errorCode: string;
}

class IncorrectPasswordError extends UnauthorizedError {
  constructor(message: string) {
    super(message);
    this.name = "IncorrectPasswordError";
    this.errorCode = "INCORRECT_PASSWORD";
  }
}

export default IncorrectPasswordError;
