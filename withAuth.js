// components/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const isAuthenticated = useStore((s) => s.isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/');
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center page-bg">
          <div className="w-10 h-10 border-4 border-royal/30 border-t-royal rounded-full animate-spin" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
