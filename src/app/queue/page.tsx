'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClockIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { QueueEntry } from '@/types';

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await fetch('/api/queue');
      if (response.ok) {
        const data = await response.json();
        setQueue(data.queue);
      } else {
        setError('Failed to fetch queue');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-300">Loading queue status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold mb-4">Current Queue</h1>
          <p className="text-gray-300">
            {queue.length === 0 ? 'No one in queue' : `${queue.length} ${queue.length === 1 ? 'person' : 'people'} waiting`}
          </p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid gap-6 mb-8">
          {queue.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Queue is Empty</h3>
              <p className="text-gray-500 mb-6">Be the first to join!</p>
              <Link
                href="/queue/join"
                className="bg-gold hover:bg-gold-dark text-black px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Join Queue</span>
              </Link>
            </div>
          ) : (
            <>
              {queue.map((entry, index) => (
                <div
                  key={entry._id}
                  className={`bg-card border rounded-lg p-6 ${
                    index === 0 
                      ? 'border-gold bg-gold/10' 
                      : 'border-border hover:border-gold/50'
                  } transition-colors`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`text-2xl font-bold ${
                          index === 0 ? 'text-gold' : 'text-gray-400'
                        }`}>
                          #{entry.position}
                        </span>
                        {index === 0 && (
                          <span className="bg-gold text-black px-2 py-1 rounded-full text-sm font-medium">
                            Next
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {entry.customerName}
                      </h3>
                      <p className="text-gray-300 capitalize mb-2">
                        {entry.service.replace('-', ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-gold mb-1">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          ~{entry.estimatedWait} min
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Joined: {new Date(entry.joinedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-8">
                <Link
                  href="/queue/join"
                  className="bg-gold hover:bg-gold-dark text-black px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Join Queue</span>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gold mb-4">Queue Information</h3>
          <div className="space-y-2 text-gray-300">
            <p>• Queue updates automatically every 30 seconds</p>
            <p>• Estimated wait times are approximate</p>
            <p>• You'll receive a confirmation number when joining</p>
            <p>• Please arrive when it's your turn</p>
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
