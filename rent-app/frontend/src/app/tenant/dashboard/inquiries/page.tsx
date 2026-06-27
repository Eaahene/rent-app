'use client';

import Link from 'next/link';
import { useMyInquiries } from '@/hooks/useInquiries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { MessageSquare } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

export default function TenantInquiriesPage() {
  const { data: inquiries, isLoading } = useMyInquiries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Inquiries</h1>
        <p className="text-muted-foreground">Messages you&apos;ve sent to landlords</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-24 bg-muted rounded-lg" />
          ))}
        </div>
      ) : inquiries && inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry: any) => (
            <Card key={inquiry._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Link
                      href={`/properties/${inquiry.propertyId?._id}`}
                      className="font-semibold hover:text-primary"
                    >
                      {inquiry.propertyId?.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.propertyId?.area}, {inquiry.propertyId?.city}
                    </p>
                    <p className="text-sm">{inquiry.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={inquiry.status === 'replied' ? 'default' : 'secondary'}>
                      {inquiry.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{timeAgo(inquiry.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No inquiries yet"
          description="When you send a message to a landlord, it will appear here."
          actionLabel="Browse Properties"
          actionHref="/properties"
          icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
        />
      )}
    </div>
  );
}
