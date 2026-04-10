'use server';

import { fetchServerApi } from '../server-api';
import { syncAuthCookiesFromResponse } from '../auth-cookies';

export default async function register(prevState: any, formData: FormData) {
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const email = formData.get('email');
  const password = formData.get('password');

  // todo: do request data validation

  //   call auth service
  try {
    const response = await fetchServerApi('/api/auth/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('error', error);
      return {
        type: 'error',
        message: error.errors[0].msg,
      };
    }

    const synced = await syncAuthCookiesFromResponse(response);

    if (!synced) {
      return {
        type: 'error',
        message: 'No cookies were found!',
      };
    }

    return {
      type: 'success',
      message: 'Loggin successfully!',
    };
  } catch (err: any) {
    return {
      type: 'error',
      message: err.message,
    };
  }
}
