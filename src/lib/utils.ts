import { clsx, type ClassValue } from 'clsx';
import CryptoJS from 'crypto-js';
import { twMerge } from 'tailwind-merge';
import { CartItem } from './store/features/cart/cartSlice';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashTheItem(payload: CartItem): string {
  const jsonString = JSON.stringify({ ...payload, qty: undefined });

  const hash = CryptoJS.SHA256(jsonString).toString();

  return hash;
}
