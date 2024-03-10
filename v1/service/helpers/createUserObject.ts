import { ModelUser, OmitPasswordHash, User } from "../../types/user.types";
import { snakeToCamelCase } from "./snakeToCamelCase";

export const createUserObject = (input: ModelUser): User => {
  const { password_hash, ...rest } = input;

  return snakeToCamelCase(rest);
};
