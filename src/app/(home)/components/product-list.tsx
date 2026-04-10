import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchServerApi } from '@/lib/server-api';
import { Category, Product } from '@/lib/types';
import ProductCard from './product-card';

const ProductList = async ({
  searchParams,
}: {
  searchParams: Promise<{ restaurantId?: string }>;
}) => {
  const params = await searchParams;
  const restaurantId = params.restaurantId;

  const categoryResponse = await fetchServerApi('/api/catalog/categories', {
    next: {
      revalidate: 120, // 2 min
    },
  });

  if (!categoryResponse.ok) {
    throw new Error('Failed to fetch catalog data');
  }

  const categoriesData = await categoryResponse.json();
  const categories: Category[] =
    Array.isArray(categoriesData.categories) ? categoriesData.categories : [];

  if (categories.length === 0) {
    return (
      <section>
        <div className="max-w-330 px-6 mx-auto py-12">
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-8 py-12 text-center">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Catalog is empty right now.
            </h2>
            <p className="mt-3 text-neutral-600">
              Add categories and products from the admin UI, then refresh this page.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const productsPath =
    restaurantId ?
      `/api/catalog/products?perPage=100&tenantId=${restaurantId}`
    : null;

  const productsResponse =
    productsPath ?
      await fetchServerApi(productsPath, {
        next: {
          revalidate: 120, // 2 min
        },
      })
    : null;

  if (productsResponse && !productsResponse.ok) {
    throw new Error('Failed to fetch catalog data');
  }

  const productsData =
    productsResponse ? await productsResponse.json() : { data: [] };
  const products: Product[] = Array.isArray(productsData.data) ? productsData.data : [];
  const emptyProductMessage =
    restaurantId ?
      'No products are available for this restaurant yet.'
    : 'Select a restaurant to see its menu.';

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
            const visibleProducts = products.filter(
              (product) => product.category._id === category._id,
            );

            return (
              <TabsContent key={category._id} value={category._id}>
                {visibleProducts.length === 0 ?
                  <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center text-neutral-600">
                    {emptyProductMessage}
                  </div>
                : <div className="grid grid-cols-4 gap-6 mt-6">
                    {visibleProducts.map((product) => (
                      <ProductCard product={product} key={product._id} />
                    ))}
                  </div>
                }
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default ProductList;
