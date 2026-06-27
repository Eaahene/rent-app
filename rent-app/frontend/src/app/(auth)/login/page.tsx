'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/forms/LoginForm';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom');

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span>RentApp</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
