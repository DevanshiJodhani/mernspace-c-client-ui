import cookie from 'cookie';
import { cookies } from 'next/headers';

export async function POST() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/auth/refresh`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${(await cookies()).get('accessToken')?.value}`,
        cookie: `refreshToken=${(await cookies()).get('refreshToken')?.value}`,
      },
    },
  );

  if (!response.ok) {
    console.log('Refresh failed!');
    return Response.json({ success: false });
  }

  const c = response.headers.getSetCookie();
  const accessToken = c.find((cookie) => cookie.includes('accessToken'));
  const refreshToken = c.find((cookie) => cookie.includes('refreshToken'));

  if (!accessToken || !refreshToken) {
    console.log('Tokens could not found');
    return Response.json({ success: false });
  }

  const parsedAccessToke = cookie.parse(accessToken);
  const parsedRefreshToken = cookie.parse(refreshToken);

  if (!parsedAccessToke.accessToken || !parsedRefreshToken.refreshToken) {
    return {
      type: 'error',
      message: 'Invalid token cookies received!',
    };
  }

  const cookieStore = await cookies();

  cookieStore.set({
    name: 'accessToken',
    value: parsedAccessToke.accessToken,
    expires:
      parsedAccessToke.expires ? new Date(parsedAccessToke.expires) : undefined,
    httpOnly: true,
    path: parsedAccessToke.Path ?? '/',
    domain: parsedAccessToke.Domain,
    sameSite: 'strict',
  });

  cookieStore.set({
    name: 'refreshToken',
    value: parsedRefreshToken.refreshToken,
    expires:
      parsedRefreshToken.expires ?
        new Date(parsedRefreshToken.expires)
      : undefined,
    httpOnly: true,
    path: parsedRefreshToken.Path ?? '/',
    domain: parsedRefreshToken.Domain,
    sameSite: 'strict',
  });

  return Response.json({ success: true });
}
