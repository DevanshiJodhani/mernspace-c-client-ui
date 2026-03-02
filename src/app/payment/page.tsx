'use client';

import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  CheckCircle2,
  CircleX,
  LayoutDashboard,
  Store,
} from 'lucide-react';
import Link from 'next/link';

const Payment = () => {
  const searchParams = useSearchParams();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  const restaurantId = searchParams.get('restaurantId');

  const isOrderSuccess = success === 'true';

  return (
    <div className="flex flex-col items-center gap-4 w-full mt-32">
      {isOrderSuccess ?
        <>
          <CheckCircle2 size={80} className="text-green-500" />
          <h1 className="text-2xl font-bold mt-2 text-center">
            Order placed successfully.
          </h1>
          <p className="text-base font-semibold -mt-2">
            Thank you for your order.
          </p>
        </>
      : <>
          <CircleX size={80} className="text-red-500" />
          <h1 className="text-2xl font-bold mt-2 text-center">
            Payment has been failed.
          </h1>
          <p className="text-base font-semibold -mt-2">Please try again.</p>
        </>
      }

      {isOrderSuccess && orderId && (
        <Card className="mt-6">
          <CardHeader className="p-4">
            <CardTitle className="flex items-start text-lg justify-between gap-12">
              <div className="flex item-center gap-3">
                <Store size={35} className="text-primary" />
                <span>Your order information</span>
              </div>
              <Badge className="text-base px-4" variant="secondary">
                Confirmed
              </Badge>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} />
              <h2 className="text-base font-medium">Order reference:</h2>
              <Link
                href={`/order-status/${orderId}?restaurantId=${restaurantId}`}
                className="underline">
                {orderId}
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {isOrderSuccess && orderId ?
        <Button asChild className="mt-6">
          <Link href={`/order-status/${orderId}?restaurantId=${restaurantId}`}>
            Go to order status page
          </Link>
        </Button>
      : <Button asChild className="mt-6">
          <Link href={`/checkout?restaurantId=${restaurantId}`}>
            Go to checkout
          </Link>
        </Button>
      }
    </div>
  );
};

export default Payment;
