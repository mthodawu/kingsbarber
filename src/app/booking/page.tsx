'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns';

export default function BookingPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [barbers, setBarbers] = useState<Array<{_id: string, name: string}>>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    service: 'haircut',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    { id: 'haircut', name: 'Classic Haircut', time: '30 min' },
    { id: 'beard-trim', name: 'Beard Trim', time: '20 min' },
    { id: 'haircut-beard', name: 'Haircut + Beard', time: '45 min' },
    { id: 'shave', name: 'Hot Towel Shave', time: '25 min' },
    { id: 'styling', name: 'Hair Styling', time: '35 min' },
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
  ];

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await fetch('/api/barbers');
      if (response.ok) {
        const data = await response.json();
        setBarbers(data.barbers);
      }
    } catch (error) {
      console.error('Failed to fetch barbers:', error);
    }
  };

  const getWeekDays = (startDate: Date) => {
    const start = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, new Date()) && !isToday(date)) return;
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: selectedDate.toISOString(),
          time: selectedTime,
          barberId: selectedBarber || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/confirmation?type=appointment&confirmation=${data.appointment.confirmationNumber}`);
      } else {
        setError(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const weekDays = getWeekDays(currentWeek);

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold mb-4">Book an Appointment</h1>
          <p className="text-gray-300">
            Select your preferred date and time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gold">Select Date</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                  className="p-2 text-gray-400 hover:text-gold transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-white font-medium">
                  {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
                </span>
                <button
                  onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                  className="p-2 text-gray-400 hover:text-gold transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(date => {
                const isPast = isBefore(date, new Date()) && !isToday(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isTodayDate = isToday(date);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateSelect(date)}
                    disabled={isPast}
                    className={`
                      aspect-square rounded-lg text-sm font-medium transition-colors
                      ${isPast 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : isSelected 
                          ? 'bg-gold text-black' 
                          : isTodayDate 
                            ? 'bg-gold/20 text-gold border border-gold' 
                            : 'text-gray-300 hover:bg-gray-800'
                      }
                    `}
                  >
                    {format(date, 'd')}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gold mb-4">
                  Available Times for {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${selectedTime === time 
                          ? 'bg-gold text-black' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-gold mb-6">Your Information</h2>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white placeholder-gray-400"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gold mb-2">
                  Select Service *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white"
                >
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.time})
                    </option>
                  ))}
                </select>
              </div>

              {barbers.length > 0 && (
                <div>
                  <label htmlFor="selectedBarber" className="block text-sm font-medium text-gold mb-2">
                    Preferred Barber (Optional)
                  </label>
                  <select
                    id="selectedBarber"
                    name="selectedBarber"
                    value={selectedBarber}
                    onChange={(e) => setSelectedBarber(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white"
                  >
                    <option value="">Any available barber</option>
                    {barbers.map(barber => (
                      <option key={barber._id} value={barber._id}>
                        {barber.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gold mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Any special requests or notes..."
                />
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <h3 className="text-gold font-medium mb-2">Appointment Summary</h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Date: {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                    <p>Time: {selectedTime}</p>
                    <p>Service: {services.find(s => s.id === formData.service)?.name}</p>
                    {selectedBarber && (
                      <p>Barber: {barbers.find(b => b._id === selectedBarber)?.name}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime}
                  className="flex-1 bg-gold hover:bg-gold-dark disabled:bg-gray-600 text-black disabled:text-gray-400 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
                <Link
                  href="/queue/join"
                  className="flex-1 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black px-6 py-3 rounded-lg font-bold text-center transition-colors"
                >
                  Join Queue Instead
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-gold hover:text-gold-light transition-colors underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
