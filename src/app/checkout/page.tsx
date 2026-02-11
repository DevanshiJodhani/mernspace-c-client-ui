import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CustomerForm from './components/customerForm';

const Checkout = async ({
  searchParams,
}: {
  searchParams: Promise<{ restaurantId?: string }>;
}) => {
  const params = await searchParams;

  const sParams = new URLSearchParams(params as Record<string, string>);
  const existingQueryString = sParams.toString();

  sParams.append('return-to', `/checkout?${existingQueryString}`);

  const session = await getSession();

  if (!session) {
    redirect(`/login?${sParams.toString()}`);
  }

  return <CustomerForm />;
};

export default Checkout;
