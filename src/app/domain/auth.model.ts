import { User } from ".";
import { Err } from "./err.model";

export interface Auth {
  user?: User;
  userId?: string;
  token?: string;
  err?: Err;
}