'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { useDashboardStats } from '@/hooks/useAdmin';
import { Users, Building2, MessageSquare, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: statsData, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const stats = statsData?.stats;

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Building2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pending Approval',
      value: stats?.pendingProperties || 0,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Total Inquiries',
      value: stats?.totalInquiries || 0,
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      {stats && <AnalyticsCharts stats={stats} />}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {statsData?.recentUsers?.length > 0 ? (
              <div className="space-y-3">
                {statsData.recentUsers.map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent users</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {statsData?.recentProperties?.length > 0 ? (
              <div className="space-y-3">
                {statsData.recentProperties.map((property: any) => (
                  <div key={property._id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {property.city} - GH₵ {(property.price).toLocaleString()}/mo
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {property.isApproved ? '✓' : '⏳'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent properties</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
