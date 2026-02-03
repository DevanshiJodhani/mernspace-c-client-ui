import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Product } from '@/lib/types';
import ProductModel from './product-model';

type PropTypes = {
  product: Product;
};

const ProductCard = ({ product }: PropTypes) => {
  return (
    <Card className="border-none rounded-xl">
      <CardHeader className="flex items-center justify-center">
        <Image alt="pizza-image" src={product.image} width={150} height={150} />
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="mt-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between mt-6">
        <p>
          <span>From </span>
          <span className="font-bold">₹{100}</span>
        </p>

        <ProductModel product={product} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
