'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { MoreHorizontal, Check, X, Star, Trash2, Eye } from 'lucide-react';
import { Property } from '@/types';
import { formatPrice, timeAgo } from '@/lib/utils';

interface PropertyTableProps {
  properties: Property[];
  onApprove?: (id: string, isApproved: boolean) => void;
  onToggleFeatured?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PropertyTable({ properties, onApprove, onToggleFeatured, onDelete }: PropertyTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead className="hidden md:table-cell">Landlord</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">Approved</TableHead>
            <TableHead className="hidden sm:table-cell">Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image
                      src={property.images[0]?.url || '/placeholder.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/admin/dashboard/properties/${property._id}`}
                      className="font-medium line-clamp-1 hover:underline"
                    >
                      {property.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {property.area}, {property.city}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <p className="text-sm">{(property.landlordId as any)?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(property.landlordId as any)?.email}
                </p>
              </TableCell>
              <TableCell>
                <p className="font-medium">{formatPrice(property.price)}/mo</p>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {property.isApproved ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {property.isFeatured ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/dashboard/properties/${property._id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {!property.isApproved ? (
                      <DropdownMenuItem onClick={() => onApprove?.(property._id, true)}>
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onApprove?.(property._id, false)}>
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onToggleFeatured?.(property._id)}>
                      <Star className="h-4 w-4 mr-2" />
                      {property.isFeatured ? 'Unfeature' : 'Feature'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(property._id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
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
