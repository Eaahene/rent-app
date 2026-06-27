'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { MoreHorizontal, Check, Mail, Reply, Eye } from 'lucide-react';
import { Inquiry } from '@/types';
import { timeAgo } from '@/lib/utils';
import { useReplyToInquiry, useUpdateInquiryStatus } from '@/hooks/useInquiries';
import toast from 'react-hot-toast';

interface InquiryTableProps {
  inquiries: Inquiry[];
  onStatusChange?: (id: string, status: string) => void;
}

export function InquiryTable({ inquiries, onStatusChange }: InquiryTableProps) {
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const replyMutation = useReplyToInquiry();
  const statusMutation = useUpdateInquiryStatus();

  const handleReply = () => {
    if (!selectedInquiry || !replyText.trim()) return;
    replyMutation.mutate(
      { id: selectedInquiry._id, reply: replyText.trim() },
      {
        onSuccess: () => {
          toast.success('Reply sent successfully');
          setReplyDialogOpen(false);
          setReplyText('');
          setSelectedInquiry(null);
        },
        onError: () => {
          toast.error('Failed to send reply');
        },
      }
    );
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setViewDialogOpen(true);
    if (inquiry.status === 'pending') {
      statusMutation.mutate({ id: inquiry._id, status: 'read' });
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'read':
        return 'secondary';
      case 'replied':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead className="hidden md:table-cell">Property</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry._id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{inquiry.tenantId?.name}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.tenantId?.email}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <p className="text-sm line-clamp-1">
                    {typeof inquiry.propertyId === 'object' && inquiry.propertyId?.title}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm line-clamp-2">{inquiry.message}</p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={statusVariant(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <p className="text-sm text-muted-foreground">{timeAgo(inquiry.createdAt)}</p>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewInquiry(inquiry)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setReplyDialogOpen(true);
                        }}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </DropdownMenuItem>
                      {inquiry.status !== 'read' && (
                        <DropdownMenuItem onClick={() => onStatusChange?.(inquiry._id, 'read')}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Inquiry Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">From</p>
                <p>{selectedInquiry.tenantId?.name} ({selectedInquiry.tenantId?.email})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Property</p>
                <p>{typeof selectedInquiry.propertyId === 'object' && selectedInquiry.propertyId?.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="text-sm">{selectedInquiry.message}</p>
              </div>
              {selectedInquiry.reply && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Your Reply</p>
                  <p className="text-sm">{selectedInquiry.reply}</p>
                  {selectedInquiry.repliedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Replied {timeAgo(selectedInquiry.repliedAt)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              setReplyDialogOpen(true);
            }}>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {selectedInquiry?.tenantId?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Their Message</p>
              <p className="text-sm bg-muted p-3 rounded-lg">{selectedInquiry?.message}</p>
            </div>
            {selectedInquiry?.reply && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Previous Reply</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedInquiry.reply}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {selectedInquiry?.reply ? 'Send Another Reply' : 'Your Reply'}
              </p>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setReplyDialogOpen(false);
              setReplyText('');
              setSelectedInquiry(null);
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleReply}
              disabled={!replyText.trim() || replyMutation.isPending}
            >
              {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
