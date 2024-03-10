import { ModelUser, UserInput } from "../../types/user.types";
import bcrypt from "bcrypt";

export const checkPasswordMatch = async (
  input: UserInput,
  user: ModelUser,
): Promise<boolean> => {
  return bcrypt.compare(input.password, user.password_hash);
};
