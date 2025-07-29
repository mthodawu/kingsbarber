'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  CalendarIcon as CalendarIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isBarberRoute = pathname?.startsWith('/barber');

  const customerLinks = [
    { 
      href: '/', 
      label: 'Home',
      icon: HomeIcon,
      iconSolid: HomeIconSolid
    },
    { 
      href: '/queue', 
      label: 'Queue',
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid
    },
    { 
      href: '/booking', 
      label: 'Book',
      icon: CalendarIcon,
      iconSolid: CalendarIconSolid
    },
  ];

  const barberLinks = [
    { 
      href: '/barber/dashboard', 
      label: 'Dashboard',
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid
    },
    { 
      href: '/barber/queue', 
      label: 'Queue',
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid
    },
    { 
      href: '/barber/appointments', 
      label: 'Appointments',
      icon: CalendarIcon,
      iconSolid: CalendarIconSolid
    },
  ];

  const links = isBarberRoute ? barberLinks : customerLinks;

  return (
    <>
      {/* Top brand bar - only visible on larger screens */}
      {/* <div className="hidden  bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-gold">King's Barber</span>
            </Link>
            
            {session && isBarberRoute && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 sm:w-full max-w-lg mx-4 mb-4 bg-black/30 backdrop-blur-md border border-border z-50 rounded-full shadow-2xl">
        <div className="px-4">
          <div className="flex justify-around items-center py-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = isActive ? link.iconSolid : link.icon;
          
          return (
            <Link
          key={link.href}
          href={link.href}
          className="flex flex-col items-center py-2 px-3 min-w-0 flex-1 text-md"
            >
          <Icon 
            className={`h-5 w-5 sm:h-6 sm:w-6 mb-1 ${
              isActive ? 'text-gold' : 'text-gray-400'
            } transition-colors`} 
          />
          <span 
            className={`text-md ${
              isActive ? 'text-gold' : 'text-gray-400'
            } transition-colors truncate`}
          >
            {link.label}
          </span>
            </Link>
          );
        })}
        
        {/* User/Profile Section */}
        <div className="flex flex-col items-center py-2 px-3 min-w-0 flex-1">
          {session && isBarberRoute ? (
            <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex flex-col items-center"
            >
          <UserIconSolid className="h-5 sm:h-6 w-5 sm:w-6 mb-1 text-gold transition-colors" />
          <span className="text-sm text-gold transition-colors truncate">
            Profile
          </span>
            </button>
          ) : (
            <Link
          href="/barber/login"
          className="flex flex-col items-center"
            >
          <UserIcon className="h-5 sm:h-6 w-5 sm:w-6 mb-1 text-gray-400 transition-colors" />
          <span className="text-sm text-gray-400 transition-colors truncate">
            {isBarberRoute ? 'Login' : 'Barber'}
          </span>
            </Link>
          )}
        </div>
          </div>
        </div>
        
        {/* User menu dropdown */}
        {showUserMenu && session && isBarberRoute && (
          <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setShowUserMenu(false)}
        />
        
        {/* Menu content */}
        <div className="absolute bottom-full left-0 right-0 bg-black/40 backdrop-blur-md border border-gold/20 rounded-t-2xl z-50 mb-2">
          <div className="px-4 py-3">
            <div className="text-center mb-3">
          <p className="text-gray-300 text-sm">Welcome, {session.user.name}</p>
            </div>
            <button
          onClick={() => {
            signOut();
            setShowUserMenu(false);
          }}
          className="w-full bg-red-600/80 hover:bg-red-700/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors text-sm border border-red-500/30"
            >
          Sign Out
            </button>
          </div>
        </div>
          </>
        )}
      </nav>
    </>
  );
}
