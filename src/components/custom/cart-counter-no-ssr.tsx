'use client';

import dynamic from 'next/dynamic';

const CartCounterWithoutSSR = dynamic(() => import('./cart-counter'), {
  ssr: false,
});

const CartCounterNoSSR = () => {
  return <CartCounterWithoutSSR />;
};

export default CartCounterNoSSR;
