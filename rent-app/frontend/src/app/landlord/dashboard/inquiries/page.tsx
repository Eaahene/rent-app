'use client';

import { useLandlordInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries';
import { InquiryTable } from '@/components/landlord/InquiryTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LandlordInquiriesPage() {
  const { data: inquiries, isLoading } = useLandlordInquiries();
  const updateInquiryStatus = useUpdateInquiryStatus();

  const handleStatusChange = (id: string, status: string) => {
    updateInquiryStatus.mutate(
      { id, status },
      { onSuccess: () => toast.success('Status updated') }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">Messages from potential tenants</p>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-64 bg-muted rounded-lg" />
      ) : inquiries && inquiries.length > 0 ? (
        <InquiryTable inquiries={inquiries} onStatusChange={handleStatusChange} />
      ) : (
        <EmptyState
          title="No inquiries yet"
          description="When tenants send you messages, they will appear here."
          icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
        />
      )}
    </div>
  );
}
