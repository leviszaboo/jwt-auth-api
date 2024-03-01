import ConflictError from "../global/ConflictError";

interface EmailExistsError extends ConflictError {
  errorCode: string;
}

class EmailExistsError extends ConflictError {
  constructor(message: string) {
    super(message);
    this.name = "EmailExistsError";
    this.errorCode = "EMAIL_ALREADY_EXISTS";
  }
}

export default EmailExistsError;
