
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a string input to a number
 * Returns null if the input is not a valid number
 */
export function toNumber(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? null : parsed;
}

/**
 * Safely converts a string input to an integer
 * Returns null if the input is not a valid integer
 */
export function toInteger(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  const parsed = typeof value === 'string' ? parseInt(value, 10) : Math.floor(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Formats a number as a currency value
 * Example: formatCurrency(1000) => "₹1,000"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
