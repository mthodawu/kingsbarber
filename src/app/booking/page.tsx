'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns';
import { Listbox, Transition, RadioGroup } from '@headlessui/react';
import { Fragment } from 'react';

export default function BookingPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [barbers, setBarbers] = useState<Array<{_id: string, name: string}>>([]);
  const [selectedBarberObj, setSelectedBarberObj] = useState<{_id: string, name: string} | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    { id: 'haircut', name: 'Classic Haircut', time: '30 min' },
    { id: 'beard-trim', name: 'Beard Trim', time: '20 min' },
    { id: 'haircut-beard', name: 'Haircut + Beard', time: '45 min' },
    // { id: 'shave', name: 'Hot Towel Shave', time: '25 min' },
    // { id: 'styling', name: 'Hair Styling', time: '35 min' },
  ];

  const [selectedService, setSelectedService] = useState(services[0]);

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
          service: selectedService.id,
          date: selectedDate.toISOString(),
          time: selectedTime,
          barberId: selectedBarberObj?._id || null,
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
                      aspect-square rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black
                      ${isPast 
                        ? 'text-gray-600 cursor-not-allowed opacity-50' 
                        : isSelected 
                          ? 'bg-gold text-black shadow-lg transform scale-105' 
                          : isTodayDate 
                            ? 'bg-gold/20 text-gold border border-gold hover:bg-gold/30' 
                            : 'text-gray-300 hover:bg-gray-800 hover:text-gold'
                      }
                    `}
                    aria-label={`Select ${format(date, 'EEEE, MMMM d, yyyy')}`}
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
                <RadioGroup value={selectedTime} onChange={setSelectedTime}>
                  <RadioGroup.Label className="sr-only">Select a time slot</RadioGroup.Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <RadioGroup.Option
                        key={time}
                        value={time}
                        className={({ active, checked }) =>
                          `${
                            active
                              ? 'ring-2 ring-gold ring-offset-2 ring-offset-black'
                              : ''
                          }
                          ${
                            checked ? 'bg-gold text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }
                          relative flex cursor-pointer rounded-lg px-3 py-2 focus:outline-none transition-colors`
                        }
                      >
                        {({ active, checked }) => (
                          <div className="flex w-full items-center justify-center">
                            <div className="text-sm font-medium">
                              {time}
                            </div>
                            {checked && (
                              <CheckIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                            )}
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
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
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 text-white placeholder-gray-400"
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
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Select Service *
                </label>
                <Listbox value={selectedService} onChange={setSelectedService}>
                  <div className="relative">
                    <Listbox.Button className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white text-left cursor-pointer">
                      <span className="block truncate">{selectedService.name} ({selectedService.time})</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-card border border-border py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {services.map((service) => (
                          <Listbox.Option
                            key={service.id}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-gold/10 text-gold' : 'text-gray-300'
                              }`
                            }
                            value={service}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {service.name} ({service.time})
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gold">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {barbers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gold mb-2">
                    Preferred Barber (Optional)
                  </label>
                  <Listbox value={selectedBarberObj} onChange={setSelectedBarberObj}>
                    <div className="relative">
                      <Listbox.Button className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white text-left cursor-pointer">
                        <span className="block truncate">
                          {selectedBarberObj ? selectedBarberObj.name : 'Any available barber'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-card border border-border py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Listbox.Option
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-gold/10 text-gold' : 'text-gray-300'
                              }`
                            }
                            value={null}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  Any available barber
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gold">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                          {barbers.map((barber) => (
                            <Listbox.Option
                              key={barber._id}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-gold/10 text-gold' : 'text-gray-300'
                                }`
                              }
                              value={barber}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {barber.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gold">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
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
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-200 text-white placeholder-gray-400 resize-none"
                  placeholder="Any special requests or notes..."
                />
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <h3 className="text-gold font-medium mb-2">Appointment Summary</h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Date: {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                    <p>Time: {selectedTime}</p>
                    <p>Service: {selectedService.name}</p>
                    {selectedBarberObj && (
                      <p>Barber: {selectedBarberObj.name}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime}
                  className="flex-1 bg-gold hover:bg-gold-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 px-6 py-3 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black transform hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
                <Link
                  href="/queue/join"
                  className="flex-1 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black px-6 py-3 rounded-lg font-bold text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-black transform hover:scale-105"
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
