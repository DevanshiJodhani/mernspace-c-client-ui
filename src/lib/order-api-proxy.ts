import { cookies } from 'next/headers';
import { fetchServerApi } from '@/lib/server-api';

const FORWARDED_REQUEST_HEADERS = ['accept', 'content-type', 'idempotency-key'];

const getResponseHeaders = (response: Response) => {
  const headers = new Headers();
  const contentType = response.headers.get('content-type');

  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  return headers;
};

export const proxyOrderApiRequest = async (request: Request, path: string) => {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return Response.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  const headers = new Headers();

  for (const headerName of FORWARDED_REQUEST_HEADERS) {
    const headerValue = request.headers.get(headerName);

    if (headerValue) {
      headers.set(headerName, headerValue);
    }
  }

  headers.set('Authorization', `Bearer ${accessToken}`);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const response = await fetchServerApi(path, init);

  return new Response(await response.text(), {
    status: response.status,
    headers: getResponseHeaders(response),
  });
};
