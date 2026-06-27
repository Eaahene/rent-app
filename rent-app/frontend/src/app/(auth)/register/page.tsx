'use client';

import { useSearchParams } from 'next/navigation';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span>RentApp</span>
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground mt-1">
            {role === 'landlord'
              ? 'List your property and find great tenants'
              : 'Find your perfect rental home'}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
