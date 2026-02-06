'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ToppingList from './topping-list';
import { CircleCheck, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, Topping } from '@/lib/types';
import { startTransition, Suspense, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { addToCart, CartItem } from '@/lib/store/features/cart/cartSlice';
import { hashTheItem } from '@/lib/utils';
import { toast } from 'sonner';

type ChosenConfig = {
  [key: string]: string;
};

const SuccessToast = () => (
  <div className="flex items-center gap-2">
    <CircleCheck className="text-green-600" />
    <span className="font-bold">Added to cart</span>
  </div>
);

const ProductModel = ({ product }: { product: Product }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const dispatch = useAppDispatch();

  const defaultConfiguration = Object.entries(
    product.category.priceConfiguration,
  )
    .map(([key, value]) => {
      return { [key]: value.availableOptions[0] };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const [chosenConfig, setChosenConfig] = useState<ChosenConfig>(
    defaultConfiguration as unknown as ChosenConfig,
  );

  const handleRadioChange = (key: string, data: string) => {
    startTransition(() => {
      setChosenConfig((prev) => {
        return {
          ...prev,
          [key]: data,
        };
      });
    });
  };

  const handleAddToCart = (product: Product) => {
    // todo: add to cart logic
    const itemToAdd: CartItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      priceConfiguration: product.priceConfiguration,
      chosenConfiguration: {
        priceConfiguration: chosenConfig!,
        selectedToppings: selectedToppings,
      },
      qty: 1,
    };

    dispatch(addToCart(itemToAdd));
    setSelectedToppings([]);
    setDialogOpen(false);
    toast(<SuccessToast />);
  };

  // Handling Topping
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

  const totalPrice = useMemo(() => {
    const toppingsTotal = selectedToppings.reduce(
      (acc, curr) => acc + curr.price,
      0,
    );

    const configPricing = Object.entries(chosenConfig).reduce(
      (acc, [key, value]: [string, string]) => {
        const price = product.priceConfiguration[key].availableOptions[value];
        return acc + price;
      },
      0,
    );

    return configPricing + toppingsTotal;
  }, [chosenConfig, selectedToppings, product]);

  const alreadyHasInCart = useMemo(() => {
    const currentConfiguration = {
      _id: product._id,
      name: product.name,
      image: product.image,
      priceConfiguration: product.priceConfiguration,
      chosenConfiguration: {
        priceConfiguration: { ...chosenConfig },
        selectedToppings: selectedToppings,
      },
      qty: 1,
    };

    const hash = hashTheItem(currentConfiguration);

    return cartItems.some((item) => item.hash === hash);
  }, [product, chosenConfig, selectedToppings, cartItems]);

  const handleCheckBoxCheck = (topping: Topping) => {
    const isAlreadyExists = selectedToppings.some(
      (element: Topping) => element._id === topping._id,
    );

    startTransition(() => {
      if (isAlreadyExists) {
        setSelectedToppings((prev) =>
          prev.filter((elm: Topping) => elm._id !== topping._id),
        );
        return;
      }

      setSelectedToppings((prev: Topping[]) => [...prev, topping]);
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className="bg-orange-200 hover:bg-orange-300 text-orange-500 px-6 py-2 rounded-full shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-500">
        Choose
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <div className="flex ">
          <div className="w-1/3 bg-white rounded p-8 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              width={450}
              height={450}
            />
          </div>
          <div className="w-2/3 p-8">
            <DialogTitle className="text-xl font-bold">
              {product.name}
            </DialogTitle>

            <p className="mt-1">{product.description}</p>

            {Object.entries(product.category.priceConfiguration).map(
              ([key, value]) => {
                return (
                  <div key={key}>
                    <h4 className="mt-6">Choose the {key}</h4>
                    <RadioGroup
                      defaultValue={value.availableOptions[0]}
                      onValueChange={(data) => {
                        handleRadioChange(key, data);
                      }}
                      className="grid grid-cols-3 gap-4 mt-2">
                      {value.availableOptions.map((option) => {
                        return (
                          <div key={option}>
                            <RadioGroupItem
                              value={option}
                              id={option}
                              className="peer sr-only"
                              aria-label={option}
                            />
                            <Label
                              htmlFor={option}
                              className="flex flex-col items-center justify-between rounded-md border-2 bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                );
              },
            )}

            {/* todo: make this condition dynamic (Add hasToppings field in category document) */}
            {product.category.name === 'Pizza' && (
              <Suspense fallback={'Topping Loading...'}>
                <ToppingList
                  selectedToppings={selectedToppings}
                  handleCheckBoxCheck={handleCheckBoxCheck}
                />
              </Suspense>
            )}

            <div className="flex items-center justify-between mt-12">
              <span className="font-bold">₹{totalPrice}</span>
              <Button
                className={alreadyHasInCart ? 'bg-gray-700' : 'bg-primary'}
                disabled={alreadyHasInCart}
                onClick={() => handleAddToCart(product)}>
                <ShoppingCart />
                <span>
                  {alreadyHasInCart ? 'Already in cart' : 'Add to cart'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModel;
