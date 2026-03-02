/* eslint-disable react-hooks/refs */
'use client';

import z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrder, getCustomer } from '@/lib/http/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Coins, CreditCard, Loader } from 'lucide-react';
import AddAddress from './addAddress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Customer, OrderData } from '@/lib/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import OrderSummary from './orderSummary';
import { useAppSelector } from '@/lib/store/hooks';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

const formSchema = z.object({
  address: z.string(),
  paymentMode: z.enum(['card', 'cash']),
  comment: z.any(),
});

const CustomerForm = () => {
  const customerForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const searchParam = useSearchParams();

  const chosenCouponCode = useRef('');
  const idempotencyKeyRef = useRef('');

  const cart = useAppSelector((state) => state.cart);

  const { data: customer, isLoading } = useQuery<Customer>({
    queryKey: ['customer'],
    queryFn: async () => {
      return await getCustomer().then((res) => res.data);
    },
  });

  const { mutate, isPending: isPlaceOrderPending } = useMutation({
    mutationKey: ['order'],
    mutationFn: async (data: OrderData) => {
      const idempotencyKey =
        idempotencyKeyRef.current ?
          idempotencyKeyRef.current
        : (idempotencyKeyRef.current = uuidv4() + customer?._id);

      return await createOrder(data, idempotencyKey).then((res) => res.data);
    },
    retry: 3,
    onSuccess: (data: { paymentUrl: string | null }) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }

      alert('Order placed successfully!');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader className="animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  const handlePlaceOrder = (data: z.infer<typeof formSchema>) => {
    const tenantId = searchParam.get('restaurantId');
    if (!tenantId) {
      alert('Restaurant Id is required!');
      return;
    }
    const orderData: OrderData = {
      cart: cart.cartItems,
      couponCode: chosenCouponCode.current ? chosenCouponCode.current : '',
      tenantId: tenantId,
      customerId: customer ? customer._id : '',
      comment: data.comment,
      address: data.address,
      paymentMode: data.paymentMode,
    };

    mutate(orderData);
  };

  return (
    <Form {...customerForm}>
      <form onSubmit={customerForm.handleSubmit(handlePlaceOrder)}>
        <div className="flex mx-auto max-w-330 px-6 py-5 gap-6 ">
          <Card className="w-3/5 border-none">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="fname">First Name</Label>
                  <Input
                    disabled
                    id="fname"
                    type="text"
                    className="w-full"
                    defaultValue={customer?.firstName}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input
                    disabled
                    id="lname"
                    type="text"
                    className="w-full"
                    defaultValue={customer?.lastName}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled
                    id="email"
                    type="text"
                    className="w-full"
                    defaultValue={customer?.email}
                  />
                </div>

                <div className="grid gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name">Address</Label>
                      <AddAddress customerId={customer?._id} />
                    </div>
                    <FormField
                      name="address"
                      control={customerForm.control}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                className="grid grid-cols-2 gap-6 mt-2">
                                {customer?.addresses.map((address) => {
                                  return (
                                    <Card className="p-6" key={address.text}>
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem
                                            value={address.text}
                                            id={address.text}
                                          />
                                        </FormControl>

                                        <Label
                                          htmlFor={address.text}
                                          className="leading-normal">
                                          {address.text}
                                        </Label>
                                      </div>
                                    </Card>
                                  );
                                })}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label>Payment Mode</Label>

                  <FormField
                    name="paymentMode"
                    control={customerForm.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              className="flex gap-6">
                              <div className="w-36">
                                <FormControl>
                                  <RadioGroupItem
                                    value={'card'}
                                    id={'card'}
                                    className="peer sr-only"
                                    aria-label={'card'}
                                  />
                                </FormControl>

                                <Label
                                  htmlFor={'card'}
                                  className="flex items-center justify-center rounded-md border-2 bg-white p-2 h-16 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                  <CreditCard size={'20'} />
                                  <span className="ml-2">Card</span>
                                </Label>
                              </div>
                              <div className="w-36">
                                <FormControl>
                                  <RadioGroupItem
                                    value={'cash'}
                                    id={'cash'}
                                    className="peer sr-only"
                                    aria-label={'cash'}
                                  />
                                </FormControl>

                                <Label
                                  htmlFor={'cash'}
                                  className="flex items-center justify-center rounded-md border-2 bg-white p-2 h-16 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                  <Coins size={'20'} />
                                  <span className="ml-2 text-md">Cash</span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="fname">Comment</Label>
                  <FormField
                    name="comment"
                    control={customerForm.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <OrderSummary
            isPlaceOrderPending={isPlaceOrderPending}
            handleCouponCodeChange={(code) => {
              chosenCouponCode.current = code;
            }}
          />
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
