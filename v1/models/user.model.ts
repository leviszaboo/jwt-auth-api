import { RowDataPacket } from "mysql2";

export interface UserInput {
  email: string;
  password: string;
}

export interface User extends RowDataPacket {
  user_id: string;
  email: string;
  password_hash: string;
  email_verified: 0 | 1;
}
