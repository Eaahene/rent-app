'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Plus,
  Heart,
  MessageSquare,
  User,
  Users,
  Shield,
  Settings,
} from 'lucide-react';
import { UserRole } from '@/types';

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const landlordLinks = [
    { href: '/landlord/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/landlord/dashboard/properties', label: 'My Properties', icon: Building2 },
    { href: '/landlord/dashboard/properties/new', label: 'Add Property', icon: Plus },
    { href: '/landlord/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/landlord/dashboard/profile', label: 'Profile', icon: User },
  ];

  const tenantLinks = [
    { href: '/tenant/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/tenant/dashboard/favorites', label: 'Favorites', icon: Heart },
    { href: '/tenant/dashboard/inquiries', label: 'My Inquiries', icon: MessageSquare },
    { href: '/tenant/dashboard/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/dashboard/users', label: 'Users', icon: Users },
    { href: '/admin/dashboard/properties', label: 'Properties', icon: Building2 },
    { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const links = role === UserRole.ADMIN ? adminLinks : role === UserRole.LANDLORD ? landlordLinks : tenantLinks;

  const isActive = (href: string) => {
    if (href.endsWith('/dashboard')) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)] hidden lg:block">
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive(link.href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
