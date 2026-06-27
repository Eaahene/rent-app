'use client';

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
import { MoreHorizontal, Check, Mail } from 'lucide-react';
import { Inquiry } from '@/types';
import { timeAgo } from '@/lib/utils';

interface InquiryTableProps {
  inquiries: Inquiry[];
  onStatusChange?: (id: string, status: string) => void;
}

export function InquiryTable({ inquiries, onStatusChange }: InquiryTableProps) {
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
                    {inquiry.status !== 'read' && (
                      <DropdownMenuItem onClick={() => onStatusChange?.(inquiry._id, 'read')}>
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Read
                      </DropdownMenuItem>
                    )}
                    {inquiry.status !== 'replied' && (
                      <DropdownMenuItem onClick={() => onStatusChange?.(inquiry._id, 'replied')}>
                        <Mail className="h-4 w-4 mr-2" />
                        Mark as Replied
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
  );
}
