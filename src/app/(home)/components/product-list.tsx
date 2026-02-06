import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category, Product } from '@/lib/types';
import ProductCard from './product-card';

const ProductList = async ({
  searchParams,
}: {
  searchParams: Promise<{ restaurantId?: string }>;
}) => {
  const params = await searchParams;
  const restaurantId = params.restaurantId;

  console.log('restaurantId:', restaurantId);

  const [categoryResponse, productsResponse] = await Promise.all([
    // TODO: Add dynamic tenantId
    fetch(`${process.env.BACKEND_URL}/api/catalog/categories`, {
      next: {
        revalidate: 3600, // 1 hour
      },
    }),
    fetch(
      `${process.env.BACKEND_URL}/api/catalog/products?perPage=100&tenantId=${restaurantId}`,

      {
        next: {
          revalidate: 3600, // 1 hour
        },
      },
    ),
  ]);

  // Error handling
  if (!categoryResponse.ok || !productsResponse.ok) {
    throw new Error('Failed to fetch catalog data');
  }

  const [categoriesData, productsData] = await Promise.all([
    categoryResponse.json(),
    productsResponse.json(),
  ]);

  const categories: Category[] = categoriesData.categories;
  const products: { data: Product[] } = productsData;

  return (
    <section>
      <div className="max-w-330 px-6 mx-auto py-12">
        <Tabs defaultValue={categories[0]._id}>
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

          {categories.map((category) => {
            return (
              <TabsContent key={category._id} value={category._id}>
                <div className="grid grid-cols-4 gap-6 mt-6">
                  {products.data
                    .filter((product) => product.category._id === category._id)
                    .map((product) => (
                      <ProductCard product={product} key={product._id} />
                    ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default ProductList;
