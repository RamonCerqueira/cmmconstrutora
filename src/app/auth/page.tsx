import AuthClient from '@/components/AuthClient';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const user = await getSessionUser();

  if (user) {
    if (user.role === 'ADMIN') {
      redirect('/dashboard/rh');
    } else {
      redirect('/dashboard/candidato');
    }
  }

  return <AuthClient />;
}
