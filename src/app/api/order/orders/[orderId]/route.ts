import { proxyOrderApiRequest } from '@/lib/order-api-proxy';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const { search } = new URL(request.url);

  return proxyOrderApiRequest(request, `/api/order/orders/${orderId}${search}`);
}
