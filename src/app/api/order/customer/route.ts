import { proxyOrderApiRequest } from '@/lib/order-api-proxy';

export async function GET(request: Request) {
  return proxyOrderApiRequest(request, '/api/order/customer');
}
