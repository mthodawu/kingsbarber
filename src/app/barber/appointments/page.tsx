'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { Fragment } from 'react';

interface Appointment {
  _id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  confirmationNumber: string;
  notes?: string;
  barberId?: {
    _id: string;
    name: string;
  };
}

interface Barber {
  _id: string;
  name: string;
}

const services = [
  { id: 'haircut', name: 'Classic Haircut', time: '30 min' },
  { id: 'beard-trim', name: 'Beard Trim', time: '20 min' },
  { id: 'haircut-beard', name: 'Haircut + Beard', time: '45 min' },
  { id: 'shave', name: 'Hot Towel Shave', time: '25 min' },
  { id: 'styling', name: 'Hair Styling', time: '35 min' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
];

export default function BarberAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    service: 'haircut',
    date: '',
    time: '',
    status: 'pending' as 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled',
    notes: '',
    barberId: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchBarbers();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarbers = async () => {
    try {
      const response = await fetch('/api/barbers');
      const data = await response.json();
      if (data.success) {
        setBarbers(data.barbers);
      }
    } catch (error) {
      console.error('Failed to fetch barbers:', error);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      service: appointment.service,
      date: format(parseISO(appointment.date), 'yyyy-MM-dd'),
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes || '',
      barberId: appointment.barberId?._id || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingAppointment) return;

    try {
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingAppointment._id,
          ...formData,
          date: new Date(formData.date).toISOString(),
          barberId: formData.barberId || null
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchAppointments();
        setIsEditModalOpen(false);
        setEditingAppointment(null);
      } else {
        alert('Failed to update appointment: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`/api/appointments?id=${appointmentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchAppointments();
      } else {
        alert('Failed to delete appointment: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || serviceId;
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusOption?.color || 'bg-gray-500'}`}>
        {statusOption?.label || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold text-xl">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Appointment Management</h1>
          <p className="text-gray-300">Manage and track customer appointments</p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gold">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black border-l uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black border-l uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black border-l uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black border-l uppercase tracking-wider">
                    Barber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black border-l uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black border-l uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-white">
                            {appointment.customerName}
                          </div>
                        </div>
                        <div className="flex items-center mt-1">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-300">
                            {appointment.customerPhone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{getServiceName(appointment.service)}</div>
                      <div className="text-sm text-gray-400">#{appointment.confirmationNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-white">
                            {format(parseISO(appointment.date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center mt-1">
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <div className="text-sm text-gray-300">
                              {appointment.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {appointment.barberId?.name || 'Any available'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="text-gold hover:text-gold-light transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {appointments.length === 0 && (
            <div className="text-center py-12">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-300">No appointments</h3>
              <p className="mt-1 text-sm text-gray-500">
                No upcoming appointments found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsEditModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card border border-border p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gold mb-4"
                  >
                    Edit Appointment
                  </Dialog.Title>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black border-l mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black border-l mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black border-l mb-2">
                        Service
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white"
                      >
                        {services.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black border-l mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black border-l mb-2">
                          Time
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-3 py-2 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black border-l mb-2">
                        Barber
                      </label>
                      <select
                        value={formData.barberId}
                        onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white"
                      >
                        <option value="">Any available barber</option>
                        {barbers.map(barber => (
                          <option key={barber._id} value={barber._id}>
                            {barber.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black border-l mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' })}
                        className="w-full px-3 py-2 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black border-l mb-2">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-black border border-border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold text-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-gold px-4 py-2 text-sm font-medium text-black hover:bg-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
