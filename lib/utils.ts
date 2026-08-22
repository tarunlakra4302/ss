import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.toString().replace(/\D/g, '');
  let num = digits;
  
  if (digits.length === 12 && digits.startsWith('91')) {
    num = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    num = digits.slice(1);
  } else if (digits.length > 10) {
    num = digits.slice(-10);
  }

  return `'` + `+91-${num}`;
}
