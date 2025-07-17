import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
} 