import Link from 'next/link';
import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Building2 className="h-6 w-6 text-primary" />
              <span>RentApp</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting tenants directly with landlords. No agents, less stress, more choices.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-sm text-muted-foreground hover:text-primary">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/register?role=landlord" className="text-sm text-muted-foreground hover:text-primary">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?type=apartment" className="text-sm text-muted-foreground hover:text-primary">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=house" className="text-sm text-muted-foreground hover:text-primary">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=studio" className="text-sm text-muted-foreground hover:text-primary">
                  Studios
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="text-sm text-muted-foreground hover:text-primary">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">support@rentapp.com</li>
              <li className="text-sm text-muted-foreground">0548744723</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RentApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
