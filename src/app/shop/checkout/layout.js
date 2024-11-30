import { getAuthUser } from '@/lib/auth-context';
import { redirect } from 'next/navigation';

export default async function CheckoutLayout({ children }) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login?redirect=/shop/checkout');
  }

  return <>{children}</>;
}