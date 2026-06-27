'use client';

import Link from 'next/link';
import Image from 'next/image';
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
import { Pencil, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import { Property, PropertyStatus } from '@/types';
import { formatPrice, timeAgo } from '@/lib/utils';

interface PropertyTableProps {
  properties: Property[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PropertyTable({ properties, onEdit, onDelete }: PropertyTableProps) {
  const statusVariant = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.AVAILABLE:
        return 'default';
      case PropertyStatus.OCCUPIED:
        return 'destructive';
      case PropertyStatus.PENDING:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">Views</TableHead>
            <TableHead className="hidden sm:table-cell">Posted</TableHead>
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
                    <p className="font-medium line-clamp-1">{property.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {property.propertyType}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <p className="text-sm">{property.area}, {property.city}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium">{formatPrice(property.price)}/mo</p>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={statusVariant(property.status)}>
                  {property.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <p className="text-sm">{property.views}</p>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <p className="text-sm text-muted-foreground">{timeAgo(property.createdAt)}</p>
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
                      <Link href={`/properties/${property._id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(property._id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
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
