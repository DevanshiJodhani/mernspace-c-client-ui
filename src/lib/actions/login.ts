'use server';

import cookie from 'cookie';
import { cookies } from 'next/headers';

export default async function login(prevState: unknown, formdata: FormData) {
  const email = formdata.get('email');
  const password = formdata.get('password');

  // todo: do request data validation

  //   call auth service
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/auth/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        type: 'error',
        message: error.errors[0].message,
      };
    }

    const c = response.headers.getSetCookie();
    const accessToken = c.find((cookie) => cookie.includes('accessToken'));
    const refreshToken = c.find((cookie) => cookie.includes('refreshToken'));

    if (!accessToken || !refreshToken) {
      return {
        type: 'error',
        message: 'No cookies were found!',
      };
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
        parsedAccessToke.expires ?
          new Date(parsedAccessToke.expires)
        : undefined,
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

    return {
      type: 'success',
      message: 'Loggin successfully!',
    };
  } catch {
    return {
      type: 'error',
      message: 'An error occurred while logging in!',
    };
  }
}
