import { cookies } from 'next/headers';

export async function GET() {
  return Response.json({ token: (await cookies()).get('accessToken')?.value });
}
