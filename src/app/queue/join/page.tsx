'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JoinQueuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    service: 'haircut',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/confirmation?type=queue&confirmation=${data.queueEntry.confirmationNumber}`);
      } else {
        setError(data.error || 'Failed to join queue');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold mb-4">Join the Queue</h1>
          <p className="text-gray-300">
            Fill out the form below to join our queue
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
              <h3 className="text-gold font-medium mb-2">What happens next?</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• You'll receive a confirmation number</li>
                <li>• We'll provide an estimated wait time</li>
                <li>• You can check your position in the queue anytime</li>
                <li>• Please arrive when it's your turn</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gold hover:bg-gold-dark disabled:bg-gray-600 text-black disabled:text-gray-400 px-6 py-3 rounded-lg font-bold transition-colors"
              >
                {loading ? 'Joining Queue...' : 'Join Queue'}
              </button>
              <Link
                href="/queue"
                className="flex-1 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black px-6 py-3 rounded-lg font-bold text-center transition-colors"
              >
                View Queue
              </Link>
            </div>
          </form>
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
