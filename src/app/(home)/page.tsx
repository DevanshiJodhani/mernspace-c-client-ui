import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import Image from 'next/image';
import ProductCard, { Product } from './components/product-card';
import { Category } from '@/lib/types';

const products: Product[] = [
  {
    id: '1',
    name: 'Margarite Pizza',
    description: 'This is a very tasty and healthy pizza',
    image: '/pizza-main.png',
    price: 499,
  },
  {
    id: '2',
    name: 'Margarite Pizza',
    description: 'This is a very tasty and healthy pizza',
    image: '/pizza-main.png',
    price: 499,
  },
  {
    id: '3',
    name: 'Margarite Pizza',
    description: 'This is a very tasty and healthy pizza',
    image: '/pizza-main.png',
    price: 499,
  },
  {
    id: '4',
    name: 'Margarite Pizza',
    description: 'This is a very tasty and healthy pizza',
    image: '/pizza-main.png',
    price: 499,
  },
  {
    id: '5',
    name: 'Margarite Pizza',
    description: 'This is a very tasty and healthy pizza',
    image: '/pizza-main.png',
    price: 499,
  },
];

export default async function Home() {
  const categoryResponse = await fetch(
    `${process.env.BACKEND_URL}/api/catalog/categories`,
    {
      next: {
        revalidate: 3600, // 1 hour
      },
    },
  );

  if (!categoryResponse.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await categoryResponse.json();
  const categories: Category[] = data.categories;

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-330 px-6 flex items-center justify-between py-24">
          <div>
            <h1 className="text-7xl font-black font-sans leading-snug">
              Super Delicious Pizza in <br />
              <span className="text-primary">Only 45 Minutes!</span>
            </h1>
            <p className="text-2xl mt-8 max-w-lg leading-snug">
              Enjoy a Free Meal if Your Order Takes More Than 45 Minutes!
            </p>
            <Button className="mt-8 text-lg rounded-full py-7 px-6 font-bold">
              Get your pizza now
            </Button>
          </div>
          <div>
            <Image
              alt="pizza-main"
              src={'/pizza-main.png'}
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-330 px-6 mx-auto py-12">
          <Tabs defaultValue="pizza">
            <TabsList>
              {categories.map((category) => {
                return (
                  <TabsTrigger
                    key={category._id}
                    value={category._id}
                    className="text-md">
                    {category.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value="pizza">
              <div className="grid grid-cols-4 gap-6 mt-6">
                {products.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="beverages">
              <div className="grid grid-cols-4 gap-6 mt-6">
                {products.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>{' '}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
