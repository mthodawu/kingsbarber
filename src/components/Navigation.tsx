'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isBarberRoute = pathname?.startsWith('/barber');

  const customerLinks = [
    { href: '/', label: 'Home' },
    { href: '/queue', label: 'Queue Status' },
    { href: '/booking', label: 'Book Appointment' },
  ];

  const barberLinks = [
    { href: '/barber/dashboard', label: 'Dashboard' },
    { href: '/barber/queue', label: 'Manage Queue' },
    { href: '/barber/appointments', label: 'Appointments' },
  ];

  const links = isBarberRoute ? barberLinks : customerLinks;

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-gold">King's Barber</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-300 hover:text-gold'
                } transition-colors duration-200 pb-1`}
              >
                {link.label}
              </Link>
            ))}
            
            {session && isBarberRoute ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : !session && isBarberRoute ? (
              <Link
                href="/barber/login"
                className="bg-gold hover:bg-gold-dark text-black px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Barber Login
              </Link>
            ) : (
              <Link
                href="/barber/login"
                className="text-gray-300 hover:text-gold transition-colors"
              >
                Barber Portal
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-gold"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? 'text-gold bg-card'
                      : 'text-gray-300 hover:text-gold hover:bg-card'
                  } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {session && isBarberRoute ? (
                <div className="px-3 py-2">
                  <p className="text-gray-300 text-sm mb-2">Welcome, {session.user.name}</p>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : !session && isBarberRoute ? (
                <Link
                  href="/barber/login"
                  className="block px-3 py-2 text-gold hover:bg-card rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Barber Login
                </Link>
              ) : (
                <Link
                  href="/barber/login"
                  className="block px-3 py-2 text-gray-300 hover:text-gold hover:bg-card rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Barber Portal
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
