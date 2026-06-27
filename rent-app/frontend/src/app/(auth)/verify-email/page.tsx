'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { authService } from '@/services/auth';
import { Building2, Loader2, Check, X } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span>RentApp</span>
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-4">
              {status === 'loading' && (
                <>
                  <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin mb-4" />
                  <p className="text-muted-foreground">Verifying your email...</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
                  <p className="text-muted-foreground mb-4">
                    Your email has been verified successfully.
                  </p>
                  <Button asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
                    <X className="h-6 w-6 text-red-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
                  <p className="text-muted-foreground mb-4">
                    The verification link is invalid or has expired.
                  </p>
                  <Button asChild>
                    <Link href="/">Go Home</Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
