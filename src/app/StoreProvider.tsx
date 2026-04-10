/* eslint-disable react-hooks/refs */
'use client';
import { setInitialCartItems } from '@/lib/store/features/cart/cartSlice';
import { AppStore, makeStore } from '@/lib/store/store';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // todo: set initial cart data from localstorage
    const isLocalStorageAvailable =
      typeof window !== 'undefined' && window.localStorage;
    if (isLocalStorageAvailable) {
      const cartItems = window.localStorage.getItem('cartItems');
      try {
        if (cartItems) {
          const parsedItems = JSON.parse(cartItems);

          if (Array.isArray(parsedItems)) {
            storeRef.current.dispatch(setInitialCartItems(parsedItems));
          } else {
            window.localStorage.removeItem('cartItems');
          }
        }
      } catch (err) {
        console.error(err);
        window.localStorage.removeItem('cartItems');
      }
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
