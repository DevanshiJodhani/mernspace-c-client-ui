'use client';

import { Button } from '@/components/ui/button';
import { Topping } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';
import Image from 'next/image';

type PropType = {
  topping: Topping;
  selectedToppings: Topping[];
  handleCheckBoxCheck: (topping: Topping) => void;
};

const ToppingCard = ({
  topping,
  selectedToppings,
  handleCheckBoxCheck,
}: PropType) => {
  const isCurrentSelected = selectedToppings.some(
    (element) => element._id === topping._id,
  );

  return (
    <Button
      onClick={() => handleCheckBoxCheck(topping)}
      variant={'outline'}
      className={cn(
        'flex flex-col h-42 relative',
        isCurrentSelected ? 'border-primary' : '',
      )}>
      <Image src={topping.image} width={80} height={80} alt={topping.name} />
      <h1>{topping.name}</h1>
      <p>&#8377; {topping.price}</p>

      {isCurrentSelected && (
        <CircleCheck className="absolute top-1 right-1 text-primary" />
      )}
    </Button>
  );
};

export default ToppingCard;
