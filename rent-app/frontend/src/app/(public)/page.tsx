'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyListSkeleton } from '@/components/property/PropertySkeleton';
import { useFeaturedProperties, useRecentProperties } from '@/hooks/useProperties';
import {
  Search,
  Building2,
  Shield,
  Zap,
  Users,
  Star,
  ArrowRight,
} from 'lucide-react';
import { REGIONS } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [searchRegion, setSearchRegion] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProperties();
  const { data: recentData, isLoading: recentLoading } = useRecentProperties();

  const featured = featuredData || [];
  const recent = recentData || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchRegion) params.set('region', searchRegion);
    if (searchCity) params.set('city', searchCity);
    router.push(`/properties?${params.toString()}`);
  };

  const howItWorks = [
    {
      icon: Search,
      title: 'Search Properties',
      description: 'Browse through thousands of listings filtered by location, price, and preferences.',
    },
    {
      icon: Users,
      title: 'Connect Directly',
      description: 'Contact landlords directly without any middlemen or agents.',
    },
    {
      icon: Building2,
      title: 'Move In',
      description: 'Visit the property, finalize the deal, and move into your new home.',
    },
  ];

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Tenant',
      content: 'Found my dream apartment in just 2 days. The direct connection with the landlord made everything so much easier.',
      rating: 5,
    },
    {
      name: 'Sarah Johnson',
      role: 'Landlord',
      content: 'I was able to find reliable tenants within a week. No more paying agent fees!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Tenant',
      content: 'The search filters are amazing. I found exactly what I was looking for in my budget.',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Perfect{' '}
              <span className="text-primary">Rental Home</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Connect directly with landlords. No agents, less stress, more choices.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card rounded-xl shadow-lg border max-w-2xl mx-auto">
              <Select value={searchRegion} onValueChange={setSearchRegion}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="City or area"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Properties</h2>
              <p className="text-muted-foreground mt-1">
                Handpicked properties you&apos;ll love
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/properties">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {featuredLoading ? (
            <PropertyListSkeleton />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-1">
              Finding your next home is simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Recent Listings</h2>
              <p className="text-muted-foreground mt-1">
                Recently added properties
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/properties">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {recentLoading ? (
            <PropertyListSkeleton />
          ) : recent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recent.map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">What People Say</h2>
            <p className="text-muted-foreground mt-1">
              Trusted by thousands of tenants and landlords
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Find Your Next Home?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Join thousands of tenants and landlords who have found success on RentApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/register?role=landlord">List Your Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
