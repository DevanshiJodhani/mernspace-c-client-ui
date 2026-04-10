import { cookies } from 'next/headers';
import { fetchServerApi } from './server-api';

interface Session {
  user: User;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'customer' | 'manager';
  tenantId: number | null;
}

export const getSession = async () => {
  return await getSelf();
};

const getSelf = async (): Promise<Session | null> => {
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetchServerApi('/api/auth/auth/self', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return {
    user: (await response.json()) as User,
  };
};
