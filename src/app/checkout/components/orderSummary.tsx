import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/lib/store/hooks';
import { getItemTotal } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { verifyCoupon } from '@/lib/http/api';
import { useSearchParams } from 'next/navigation';
import { CouponCodeData } from '@/lib/types';

const TAXES_PERCENTAGE = 18;
const DELIVERY_CHARGES = 100;

const OrderSummary = () => {
  const searchParams = useSearchParams();

  const cart = useAppSelector((state) => state.cart.cartItems);

  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const couponCodeRef = useRef<HTMLInputElement>(null);

  const subTotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      return acc + curr.qty * getItemTotal(curr);
    }, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subTotal * discountPercentage) / 100);
  }, [subTotal, discountPercentage]);

  const texesAmount = useMemo(() => {
    const amountAfterDiscount = subTotal - discountAmount;

    return Math.round((amountAfterDiscount * TAXES_PERCENTAGE) / 100);
  }, [subTotal, discountAmount]);

  const grandWithDiscountTotal = useMemo(() => {
    return subTotal - discountAmount + texesAmount + DELIVERY_CHARGES;
  }, [subTotal, discountAmount, texesAmount, DELIVERY_CHARGES]);

  const grandWithoutDiscountTotal = useMemo(() => {
    return subTotal + texesAmount + DELIVERY_CHARGES;
  }, [subTotal, texesAmount, DELIVERY_CHARGES]);

  const { mutate, isError, error } = useMutation({
    mutationKey: ['couponCode'],
    mutationFn: async () => {
      if (!couponCodeRef.current) {
        return;
      }

      const restaurantId = searchParams.get('restaurantId');
      if (!restaurantId) {
        return;
      }

      const data: CouponCodeData = {
        code: couponCodeRef.current.value,
        tenantId: restaurantId,
      };

      return await verifyCoupon(data).then((res) => res.data);
    },

    onSuccess: (data) => {
      console.log('data recieved: ', data);

      if (data.valid) {
        setDiscountError('');
        setDiscountPercentage(data.discount);
        return;
      }

      setDiscountError('Coupon is invaid');
      setDiscountPercentage(0);
    },
  });

  const handleCouponValidation = (e: React.MouseEvent) => {
    e.preventDefault();

    mutate();
  };

  return (
    <Card className="w-2/5 border-none h-auto self-start">
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-bold">₹{subTotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxes</span>
          <span className="font-bold">₹{texesAmount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Delivery charges</span>
          <span className="font-bold">₹{DELIVERY_CHARGES}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Discount</span>
          <span className="font-bold">₹{discountAmount}</span>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <span className="font-bold">Order total</span>
          <span className="font-bold flex flex-col">
            <span
              className={
                discountPercentage ? 'line-through text-gray-400' : ''
              }>
              ₹{grandWithoutDiscountTotal}
            </span>

            {discountPercentage ?
              <span className="text-green-700">{grandWithDiscountTotal}</span>
            : null}
          </span>
        </div>
        {discountError && <div className="text-red-500">{discountError}</div>}
        {isError && JSON.stringify(error.message)}
        <div className="flex items-center gap-4">
          <Input
            id="coupon"
            name="code"
            type="text"
            className="w-full"
            placeholder="Coupon code"
            ref={couponCodeRef}
          />
          <Button onClick={handleCouponValidation} variant={'outline'}>
            Apply
          </Button>
        </div>

        <div className="text-right mt-6">
          <Button>Place order</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
