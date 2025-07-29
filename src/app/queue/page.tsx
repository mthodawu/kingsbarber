'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClockIcon, UserGroupIcon, PlusIcon, PlayIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { QueueEntry } from '@/types';

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'waiting':
        return { label: 'Waiting', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: ClockIcon };
      case 'in-progress':
        return { label: 'In Service', color: 'text-blue-400', bgColor: 'bg-blue-500/20', icon: PlayIcon };
      case 'completed':
        return { label: 'Completed', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: CheckIcon };
      case 'left':
        return { label: 'Left', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: XMarkIcon };
      default:
        return { label: 'Unknown', color: 'text-gray-400', bgColor: 'bg-gray-500/20', icon: ClockIcon };
    }
  };

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
              {queue.map((entry, index) => {
                const statusInfo = getStatusInfo(entry.status);
                const StatusIcon = statusInfo.icon;
                const isNext = index === 0 && entry.status === 'waiting';
                const isInProgress = entry.status === 'in-progress';
                
                return (
                  <div
                    key={entry._id}
                    className={`bg-card border rounded-lg p-6 ${
                      isNext 
                        ? 'border-gold bg-gold/10' 
                        : isInProgress
                          ? 'border-blue-500 bg-blue-500/10'
                          : entry.status === 'completed'
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-border hover:border-gold/50'
                    } transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`text-2xl font-bold ${
                            isNext ? 'text-gold' : 'text-gray-400'
                          }`}>
                            #{entry.position}
                          </span>
                          {isNext && (
                            <span className="bg-gold text-black px-2 py-1 rounded-full text-sm font-medium">
                              Next
                            </span>
                          )}
                          {isInProgress && (
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-medium animate-pulse">
                              In Service
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {entry.customerName}
                        </h3>
                        <p className="text-gray-300 capitalize mb-2">
                          {entry.service.replace('-', ' ')}
                        </p>
                        
                        {/* Status indicator */}
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusInfo.label}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {entry.status === 'waiting' && (
                          <div className="flex items-center space-x-1 text-gold mb-1">
                            <ClockIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              ~{entry.estimatedWait} min
                            </span>
                          </div>
                        )}
                        {entry.status === 'in-progress' && (
                          <div className="flex items-center space-x-1 text-blue-400 mb-1">
                            <PlayIcon className="h-4 w-4 animate-pulse" />
                            <span className="text-sm font-medium">
                              Being served
                            </span>
                          </div>
                        )}
                        {entry.status === 'completed' && (
                          <div className="flex items-center space-x-1 text-green-400 mb-1">
                            <CheckIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Done
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400">
                          Joined: {new Date(entry.joinedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
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
          
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gold mb-3">Status Legend</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
                  <ClockIcon className="h-3 w-3" />
                  <span>Waiting</span>
                </div>
                <span className="text-gray-400">In queue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                  <PlayIcon className="h-3 w-3" />
                  <span>In Service</span>
                </div>
                <span className="text-gray-400">Being served</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                  <CheckIcon className="h-3 w-3" />
                  <span>Completed</span>
                </div>
                <span className="text-gray-400">Service done</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                  <XMarkIcon className="h-3 w-3" />
                  <span>Left</span>
                </div>
                <span className="text-gray-400">No show</span>
              </div>
            </div>
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
