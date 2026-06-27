'use client';

import { useState, useCallback } from 'react';
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
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { UserRole } from '@/types';

interface SidebarProps {
  role: UserRole;
}

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

function SidebarLinks({ role, onNavigate }: { role: UserRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  const links = role === UserRole.ADMIN ? adminLinks : role === UserRole.LANDLORD ? landlordLinks : tenantLinks;

  const isActive = (href: string) => {
    if (href.endsWith('/dashboard')) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="p-4 space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
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
  );
}

export function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)] hidden lg:block">
      <SidebarLinks role={role} />
    </aside>
  );
}

export function MobileSidebar({ role }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="absolute left-0 top-0 h-full w-64 bg-background border-r shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Menu</span>
              <button onClick={close} className="rounded-md p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarLinks role={role} onNavigate={close} />
          </div>
        </div>
      )}
    </>
  );
}
