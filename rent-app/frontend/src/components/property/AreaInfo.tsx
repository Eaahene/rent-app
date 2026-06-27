'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GraduationCap,
  ShoppingBag,
  UtensilsCrossed,
  Landmark,
  HeartPulse,
  Fuel,
  TreePine,
  Building,
  MapPin,
  Clock,
} from 'lucide-react';

interface Place {
  name: string;
  category: string;
  distance: string;
  walkTime: string;
  driveTime: string;
}

interface AreaInfoProps {
  city: string;
  area: string;
  region: string;
}

const categoryIcons: Record<string, any> = {
  Schools: GraduationCap,
  Markets: ShoppingBag,
  Restaurants: UtensilsCrossed,
  Attractions: Landmark,
  Hospitals: HeartPulse,
  'Gas Stations': Fuel,
  Parks: TreePine,
  Shopping: Building,
};

function generateNearbyPlaces(city: string, area: string): Place[] {
  const cityLower = city.toLowerCase();
  const areaLower = area.toLowerCase();

  const schools: Record<string, string[]> = {
    accra: ['Oxford International School', 'Ghana International School', 'Lincoln Community School', 'American International School'],
    kumasi: ['Prempeh College', 'Kumasi Academy', 'Yaa Asantewaa Girls School', 'Opoku Ware School'],
    tema: ['Tema International School', 'Avogato School', 'Tema Preparatory School'],
    'cape coast': ['Mfantsipim School', 'Adisadel College', 'St. Augustine College', 'Wesley Girls School'],
    takoradi: ['Archbishop Porter Girls School', 'Fijai Secondary School', 'Ghana National College'],
  };

  const markets: Record<string, string[]> = {
    accra: ['Makola Market', 'Osu Market', 'Kaneshie Market', 'Madina Market'],
    kumasi: ['Kejetia Market', 'Adum Market', 'Bonwire Market'],
    tema: ['Tema Community 1 Market', 'Tema Mall'],
    'cape coast': ['Cape Coast Central Market', 'Kotokuraba Market'],
    takoradi: ['Takoradi Market Circle', 'Sekondi Market'],
  };

  const restaurants: Record<string, string[]> = {
    accra: ['Buka Restaurant', 'La Chaumiere', 'Santoku Japanese', 'Ocean Basket', 'KFC'],
    kumasi: ['Kentish Kitchen', 'Vic Baboo\'s Cafe', 'Golden Bean Restaurant'],
    tema: ['Ashiana Restaurant', 'Bistro 22'],
    'cape coast': ['Baobab House', 'Oasis Beach Resort Restaurant', 'Fisherman\'s Grill'],
    takoradi: ['Sky Bar Restaurant', 'The Ridge Restaurant', 'Salty\'s Bar & Grill'],
  };

  const attractions: Record<string, string[]> = {
    accra: ['Kwame Nkrumah Memorial', 'Jamestown Lighthouse', 'National Museum', 'Osu Castle'],
    kumasi: ['Manhyia Palace Museum', 'Kejetia Fort', 'Prempeh II Jubilee Museum'],
    tema: ['Tema Harbour', 'Tema Beach'],
    'cape coast': ['Cape Coast Castle', 'Kakum National Park', 'Elmina Castle'],
    takoradi: ['Fort Orange', 'Narrative Beach', 'Akwidaa Fort'],
  };

  const hospitals: Record<string, string[]> = {
    accra: ['Korle Bu Teaching Hospital', '37 Military Hospital', 'Nyaho Medical Centre'],
    kumasi: ['Kumasi South Hospital', 'Komfo Anokye Teaching Hospital'],
    tema: ['Tema General Hospital', '37 Military Hospital Tema'],
    'cape coast': ['Cape Coast Teaching Hospital'],
    takoradi: ['Effia-Nkwanta Regional Hospital'],
  };

  const cityKey = Object.keys(schools).find(key => cityLower.includes(key)) || 'accra';
  const distanceBase = 0.3;

  const places: Place[] = [];

  const addPlaces = (names: string[], category: string) => {
    names.forEach((name, i) => {
      const dist = (distanceBase + (i * 0.8) + Math.random() * 0.5).toFixed(1);
      const walkMin = Math.round(Number(dist) * 12);
      const driveMin = Math.max(1, Math.round(Number(dist) * 2.5));
      places.push({
        name,
        category,
        distance: `${dist} km`,
        walkTime: walkMin < 60 ? `${walkMin} min` : `${Math.floor(walkMin / 60)}h ${walkMin % 60}m`,
        driveTime: `${driveMin} min`,
      });
    });
  };

  addPlaces((schools[cityKey] || schools.accra).slice(0, 3), 'Schools');
  addPlaces((markets[cityKey] || markets.accra).slice(0, 3), 'Markets');
  addPlaces((restaurants[cityKey] || restaurants.accra).slice(0, 3), 'Restaurants');
  addPlaces((attractions[cityKey] || attractions.accra).slice(0, 2), 'Attractions');
  addPlaces((hospitals[cityKey] || hospitals.accra).slice(0, 2), 'Hospitals');

  return places;
}

export function AreaInfo({ city, area, region }: AreaInfoProps) {
  const places = generateNearbyPlaces(city, area);

  const grouped = places.reduce((acc, place) => {
    if (!acc[place.category]) acc[place.category] = [];
    acc[place.category].push(place);
    return acc;
  }, {} as Record<string, Place[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Area Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Nearby places in {area}, {city}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(grouped).map(([category, categoryPlaces]) => {
            const Icon = categoryIcons[category] || MapPin;
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm">{category}</h4>
                </div>
                <div className="space-y-2 ml-10">
                  {categoryPlaces.map((place) => (
                    <div key={place.name} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{place.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {place.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {place.walkTime} walk
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {place.driveTime} drive
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
