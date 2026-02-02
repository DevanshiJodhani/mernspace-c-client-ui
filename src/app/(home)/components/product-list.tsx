import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category, Product } from '@/lib/types';
import ProductCard from './product-card';

const ProductList = async () => {
  // todo: Add promis all
  // Fetching Categories
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

  // Fetching Products
  const productsResponse = await fetch(
    // TODO: Add dynamic tenantId
    `${process.env.BACKEND_URL}/api/catalog/products?perPage=100&tenantId=3`,

    {
      next: {
        revalidate: 3600, // 1 hour
      },
    },
  );

  if (!productsResponse.ok) {
    throw new Error('Failed to fetch categories');
  }

  const products: { data: Product[] } = await productsResponse.json();
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
