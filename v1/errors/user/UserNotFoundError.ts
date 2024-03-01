import NotFoundError from "../global/NotFoundError";

interface UserNotFoundError extends NotFoundError {
  errorCode: string;
}

class UserNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFoundError";
    this.errorCode = "USER_NOT_FOUND";
  }
}

export default UserNotFoundError;
