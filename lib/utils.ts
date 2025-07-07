import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleApiError(err: any, context: string = "") {
  const status = err.status || 500;
  const body = {
    error: err.message || "Internal Server Error",
    context,
  };
  return { status, body };
}
