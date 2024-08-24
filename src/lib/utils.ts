import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isExpired(token: string) {
  const decoded = jwt.decode(token);

  if (decoded && typeof decoded !== "string" && decoded.exp) {
    if (new Date().getTime() <= decoded.exp * 1000) {
      return false;
    }
  }

  return true;
}
