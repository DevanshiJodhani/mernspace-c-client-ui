import { proxyOrderApiRequest } from '@/lib/order-api-proxy';

export async function POST(request: Request) {
  return proxyOrderApiRequest(request, '/api/order/coupons/verify');
}
