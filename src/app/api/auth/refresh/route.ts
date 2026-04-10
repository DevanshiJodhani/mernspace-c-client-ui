import { cookies } from 'next/headers';
import { syncAuthCookiesFromResponse } from '@/lib/auth-cookies';
import { fetchServerApi } from '@/lib/server-api';

export async function POST() {
  const response = await fetchServerApi('/api/auth/auth/refresh', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${(await cookies()).get('accessToken')?.value}`,
      cookie: `refreshToken=${(await cookies()).get('refreshToken')?.value}`,
    },
  });

  if (!response.ok) {
    console.log('Refresh failed!');
    return Response.json({ success: false });
  }

  const synced = await syncAuthCookiesFromResponse(response);

  if (!synced) {
    console.log('Tokens could not found');
    return Response.json({ success: false });
  }

  return Response.json({ success: true });
}
