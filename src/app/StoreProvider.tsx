/* eslint-disable react-hooks/refs */
'use client';
import { AppStore, makeStore } from '@/lib/store/store';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // todo: set initial cart data from localstorage
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
