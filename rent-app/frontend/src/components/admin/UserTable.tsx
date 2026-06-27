'use client';

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
import { MoreHorizontal, Shield, Ban, Check } from 'lucide-react';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';

interface UserTableProps {
  users: User[];
  onVerify?: (id: string) => void;
  onToggleStatus?: (id: string, isActive: boolean) => void;
}

export function UserTable({ users, onVerify, onToggleStatus }: UserTableProps) {
  const roleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'landlord':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden sm:table-cell">Verified</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <p className="font-medium">{user.name}</p>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </TableCell>
              <TableCell>
                <Badge variant={roleVariant(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.isVerified ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="text-sm text-muted-foreground">No</span>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                  {user.isActive ? 'Active' : 'Suspended'}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.role === 'landlord' && !user.isVerified && (
                      <DropdownMenuItem onClick={() => onVerify?.(user._id)}>
                        <Shield className="h-4 w-4 mr-2" />
                        Verify Landlord
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onToggleStatus?.(user._id, !user.isActive)}
                      className={user.isActive ? 'text-destructive' : 'text-green-500'}
                    >
                      {user.isActive ? (
                        <>
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
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
