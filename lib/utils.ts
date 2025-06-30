import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ProductWithOptionalKey {
  _key?: string;
  product?: unknown;
  quantity?: number;
  priceAtTime?: number;
}

/**
 * Ensures all products in an order have _key properties
 * This fixes the "missing keys" error in Sanity Studio
 */
export function ensureProductKeys(products: ProductWithOptionalKey[]) {
  return products.map(product => ({
    ...product,
    _key: product._key || crypto.randomUUID()
  }));
}
