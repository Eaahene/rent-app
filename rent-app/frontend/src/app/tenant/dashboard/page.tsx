'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Search, Building2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useProperties';
import { useMyInquiries } from '@/hooks/useInquiries';
import { useAuth } from '@/hooks/useAuth';
import { PropertyCard } from '@/components/property/PropertyCard';

export default function TenantDashboardPage() {
  const { user } = useAuth();
  const { data: favoritesData } = useFavorites({ page: 1 });
  const { data: inquiries } = useMyInquiries();

  const favorites = favoritesData?.data || [];
  const recentInquiries = inquiries?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your rentals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{favoritesData?.pagination?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inquiries</p>
                <p className="text-2xl font-bold">{inquiries?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Search className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Searches</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Inquiries</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tenant/dashboard/inquiries">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {recentInquiries.map((inquiry: any) => (
                <div key={inquiry._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{inquiry.propertyId?.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{inquiry.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{inquiry.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No inquiries yet. Start browsing properties!
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Favorite Properties</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tenant/dashboard/favorites">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.slice(0, 3).map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No favorites yet</p>
              <Button asChild className="mt-4">
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
