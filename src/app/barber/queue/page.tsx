'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  PlayIcon,
  CheckIcon, 
  XMarkIcon,
  TrashIcon,
  PencilIcon,
  UserIcon,
  PhoneIcon,
  ClockIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface QueueEntry {
  _id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  position: number;
  estimatedWait: number;
  status: 'waiting' | 'in-progress' | 'completed' | 'left';
  confirmationNumber: string;
  joinedAt: string;
}

const services = [
  { id: 'haircut', name: 'Classic Haircut', time: '30 min' },
  { id: 'beard-trim', name: 'Beard Trim', time: '20 min' },
  { id: 'haircut-beard', name: 'Haircut + Beard', time: '45 min' },
  { id: 'shave', name: 'Hot Towel Shave', time: '25 min' },
  { id: 'styling', name: 'Hair Styling', time: '35 min' },
];

const statusOptions = [
  { value: 'waiting', label: 'Waiting', color: 'bg-yellow-500', icon: ClockIcon },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500', icon: PlayIcon },
  { value: 'completed', label: 'Completed', color: 'bg-green-500', icon: CheckIcon },
  { value: 'left', label: 'Left', color: 'bg-red-500', icon: XMarkIcon },
];

export default function BarberQueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<QueueEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    service: 'haircut',
    notes: ''
  });

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await fetch('/api/queue');
      const data = await response.json();
      if (data.success) {
        setQueue(data.queue);
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (entryId: string, status: string) => {
    try {
      if (status === 'in-progress') {
        // Convert to appointment when starting service
        const response = await fetch('/api/queue/convert-to-appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            queueId: entryId
          }),
        });

        const data = await response.json();
        if (data.success) {
          await fetchQueue();
          alert(`Customer service started! Appointment created with confirmation #${data.appointment.confirmationNumber}`);
        } else {
          alert('Failed to start service: ' + data.error);
        }
      } else {
        // Regular status update
        const response = await fetch('/api/queue', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: entryId,
            status
          }),
        });

        const data = await response.json();
        if (data.success) {
          await fetchQueue();
        } else {
          alert('Failed to update queue entry: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Failed to update queue entry:', error);
      alert('Failed to update queue entry');
    }
  };

  const handleEdit = (entry: QueueEntry) => {
    setEditingEntry(entry);
    setFormData({
      customerName: entry.customerName,
      customerPhone: entry.customerPhone,
      service: entry.service,
      notes: ''
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingEntry) return;

    try {
      const response = await fetch('/api/queue', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingEntry._id,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          service: formData.service
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchQueue();
        setIsEditModalOpen(false);
        setEditingEntry(null);
      } else {
        alert('Failed to update queue entry: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to update queue entry:', error);
      alert('Failed to update queue entry');
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to remove this customer from the queue?')) return;

    try {
      const response = await fetch(`/api/queue?id=${entryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchQueue();
      } else {
        alert('Failed to remove from queue: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to remove from queue:', error);
      alert('Failed to remove from queue');
    }
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || serviceId;
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold text-xl">Loading queue...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">Queue Management</h1>
          <p className="text-gray-300">Manage the customer queue and service flow</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
            <span>Total in queue: <span className="text-gold font-semibold">{queue.length}</span></span>
            {queue.length > 0 && (
              <span>Estimated wait for new customers: <span className="text-gold font-semibold">{formatWaitTime(queue[queue.length - 1]?.estimatedWait || 0)}</span></span>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {queue.map((entry) => {
            const statusInfo = getStatusInfo(entry.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={entry._id}
                className={`bg-card border rounded-lg p-6 hover:border-gold/50 transition-colors ${
                  entry.status === 'in-progress' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : entry.status === 'completed' 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      entry.status === 'in-progress' 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : entry.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : 'bg-gold text-black'
                    }`}>
                      {entry.status === 'in-progress' ? (
                        <PlayIcon className="h-4 w-4" />
                      ) : entry.status === 'completed' ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        entry.position
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-white">{entry.customerName}</h3>
                        {entry.status === 'in-progress' && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full animate-pulse">
                            IN SERVICE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-300">{entry.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-1 text-gray-400 hover:text-gold transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Service:</span>
                    <span className="text-sm text-white font-medium">{getServiceName(entry.service)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Wait Time:</span>
                    <span className="text-sm text-gold font-medium">{formatWaitTime(entry.estimatedWait)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Joined:</span>
                    <span className="text-sm text-gray-300">{format(new Date(entry.joinedAt), "EEE d MMM 'at' HH:mm")}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Confirmation:</span>
                    <span className="text-sm text-gray-300 font-mono">#{entry.confirmationNumber}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {entry.status === 'in-progress' ? (
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => updateQueueStatus(entry._id, 'completed')}
                        className="flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Complete Service
                      </button>
                      <div className="flex items-center justify-center text-xs text-blue-400">
                        <PlayIcon className="h-3 w-3 mr-1 animate-pulse" />
                        Service in progress...
                      </div>
                    </div>
                  ) : entry.status === 'completed' ? (
                    <div className="text-center text-green-400 text-sm font-medium">
                      <CheckIcon className="h-4 w-4 mx-auto mb-1" />
                      Service Completed
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateQueueStatus(entry._id, 'in-progress')}
                        className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Start
                      </button>
                      <button
                        onClick={() => updateQueueStatus(entry._id, 'left')}
                        className="flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        No Show
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {queue.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">Queue is empty</h3>
            <p className="mt-1 text-sm text-gray-500">
              No customers in the queue at the moment.
            </p>
          </div>
        )}
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
                    Edit Queue Entry
                  </Dialog.Title>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gold mb-2">
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
                      <label className="block text-sm font-medium text-gold mb-2">
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
                      <label className="block text-sm font-medium text-gold mb-2">
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
