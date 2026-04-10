import { syncAuthCookiesFromResponse } from '@/lib/auth-cookies';
import { fetchServerApi } from '@/lib/server-api';

export async function POST(request: Request) {
  const body = await request.text();

  const response = await fetchServerApi('/api/auth/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') ?? 'application/json',
      },
    });
  }

  const synced = await syncAuthCookiesFromResponse(response);

  if (!synced) {
    return Response.json(
      {
        success: false,
        message: 'No auth cookies were found in login response',
      },
      { status: 502 },
    );
  }

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('content-type') ?? 'application/json',
    },
  });
}
