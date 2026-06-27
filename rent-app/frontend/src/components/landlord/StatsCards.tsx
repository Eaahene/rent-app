'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Property } from '@/types';

interface StatsCardsProps {
  properties: Property[];
  inquiries?: number;
}

export function StatsCards({ properties, inquiries = 0 }: StatsCardsProps) {
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
  const availableCount = properties.filter((p) => p.status === 'available').length;

  const stats = [
    {
      title: 'Total Properties',
      value: properties.length,
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Inquiries',
      value: inquiries,
      icon: MessageSquare,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Available',
      value: availableCount,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
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
  );
}
