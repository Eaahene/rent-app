'use client';

import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Target, Eye, Phone, Mail, Loader2 } from 'lucide-react';

export default function AboutPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsService.getSettings();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const settings = data || {
    aboutTitle: 'About RentApp',
    aboutContent: 'RentApp is Ghana\'s leading rental marketplace connecting tenants directly with landlords.',
    aboutMission: 'Our mission is to simplify the rental process in Ghana.',
    aboutVision: 'To become Ghana\'s most trusted rental platform.',
    contactPhone: '0548744723',
    contactEmail: 'support@rentapp.com',
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{settings.aboutTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {settings.aboutContent}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {settings.aboutMission}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {settings.aboutVision}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose RentApp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Direct Connection</h3>
              <p className="text-muted-foreground">
                Connect directly with landlords without any middlemen or agents. Save time and money.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Verified Listings</h3>
              <p className="text-muted-foreground">
                All properties are verified to ensure you get accurate information and real listings.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Communication</h3>
              <p className="text-muted-foreground">
                Reach out to landlords instantly through our platform. No phone tag, no waiting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-8">Have questions? We&apos;re here to help.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span>{settings.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span>{settings.contactEmail}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
