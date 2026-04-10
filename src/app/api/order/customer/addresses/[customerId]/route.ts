import { proxyOrderApiRequest } from '@/lib/order-api-proxy';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params;

  return proxyOrderApiRequest(
    request,
    `/api/order/customer/addresses/${customerId}`,
  );
}
