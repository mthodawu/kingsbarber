'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalQueue: number;
  todayAppointments: number;
  nextAppointment: any;
  recentActivity: any[];
}

export default function BarberDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalQueue: 0,
    todayAppointments: 0,
    nextAppointment: null,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/barber/login');
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // Fetch queue data
      const queueResponse = await fetch('/api/queue');
      const queueData = await queueResponse.json();
      
      // Fetch appointments data
      const appointmentsResponse = await fetch('/api/appointments');
      const appointmentsData = await appointmentsResponse.json();
      
      setStats({
        totalQueue: queueData.queue?.length || 0,
        todayAppointments: appointmentsData.appointments?.length || 0,
        nextAppointment: appointmentsData.appointments?.[0] || null,
        recentActivity: []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-300">
            Here's what's happening at King's Barber today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Queue Length</p>
                <p className="text-3xl font-bold text-gold">{stats.totalQueue}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-gold" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Appointments</p>
                <p className="text-3xl font-bold text-gold">{stats.todayAppointments}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-gold" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Wait Time</p>
                <p className="text-3xl font-bold text-gold">25m</p>
              </div>
              <ClockIcon className="h-8 w-8 text-gold" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-gold">8</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-gold" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-gold mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button className="w-full bg-gold hover:bg-gold-dark text-black px-4 py-3 rounded-lg font-medium transition-colors text-left">
                Mark Next Customer as Served
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-left">
                Add Walk-in Customer
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-left">
                Update Wait Times
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-left">
                View All Appointments
              </button>
            </div>
          </div>

          {/* Next Appointment */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-gold mb-6">Next Appointment</h2>
            {stats.nextAppointment ? (
              <div className="space-y-4">
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {stats.nextAppointment.customerName}
                    </h3>
                    <span className="text-gold font-medium">
                      {stats.nextAppointment.time}
                    </span>
                  </div>
                  <p className="text-gray-300 capitalize mb-2">
                    {stats.nextAppointment.service?.replace('-', ' ')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Phone: {stats.nextAppointment.customerPhone}
                  </p>
                  {stats.nextAppointment.notes && (
                    <p className="text-gray-300 text-sm mt-2">
                      Notes: {stats.nextAppointment.notes}
                    </p>
                  )}
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Mark as Completed
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-gold mb-6">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">John Doe completed haircut appointment</span>
              <span className="text-xs text-gray-500 ml-auto">2:30 PM</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Mike Johnson joined the queue</span>
              <span className="text-xs text-gray-500 ml-auto">2:15 PM</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <span className="text-sm">Sarah Wilson booked appointment for tomorrow</span>
              <span className="text-xs text-gray-500 ml-auto">1:45 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
