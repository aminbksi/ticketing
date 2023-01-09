import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export const hashPassword = async (password: string) => {
  const salt = randomBytes(8).toString("hex");
  const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

  return `${buffer.toString("hex")}.${salt}`;
};
