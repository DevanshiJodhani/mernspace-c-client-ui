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
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { startTransition, Suspense, useState } from 'react';

type ChosenConfig = {
  [key: string]: string;
};

const ProductModel = ({ product }: { product: Product }) => {
  const [chosenConfig, setChosenConfig] = useState<ChosenConfig>();

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

  const handleAddToCart = () => {
    // todo: add to cart logic
    console.log('Adding to the cart....');
  };

  return (
    <Dialog>
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

            <Suspense fallback={'Topping Loading...'}>
              <ToppingList />
            </Suspense>

            <div className="flex items-center justify-between mt-12">
              <span className="font-bold">₹{100}</span>
              <Button onClick={handleAddToCart}>
                <ShoppingCart />
                <span>Add to cart</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModel;
