'use server';

export default async function login(prevState: unknown, formdata: FormData) {
  const email = formdata.get('email');
  const password = formdata.get('password');

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
        credentials: 'include', 
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        type: 'error',
        message: error.errors?.[0]?.msg || 'Login failed',
      };
    }

    return {
      type: 'success',
      message: 'Login successfully!',
    };
  } catch (err) {
    return {
      type: 'error',
      message: 'An error occurred while logging in!',
    };
  }
}