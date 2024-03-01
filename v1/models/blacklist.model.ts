import { RowDataPacket } from "mysql2";

export interface BlackList extends RowDataPacket {
  token: string;
}
