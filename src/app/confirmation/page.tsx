'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, ClockIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'queue' or 'appointment'
  const confirmation = searchParams.get('confirmation');

  if (!type || !confirmation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid Confirmation</h1>
          <Link href="/" className="text-gold hover:text-gold-light underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isQueue = type === 'queue';

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gold mb-4">
            {isQueue ? 'Joined Queue Successfully!' : 'Appointment Booked!'}
          </h1>
          <p className="text-gray-300 text-lg">
            {isQueue 
              ? 'You have been added to our queue' 
              : 'Your appointment has been confirmed'
            }
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Confirmation Number</h2>
            <div className="bg-gold text-black px-6 py-3 rounded-lg font-mono text-2xl font-bold inline-block">
              {confirmation}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-300">
              <UserIcon className="h-5 w-5 text-gold flex-shrink-0" />
              <span>
                Please save this confirmation number for your records
              </span>
            </div>
            
            {isQueue ? (
              <>
                <div className="flex items-center space-x-3 text-gray-300">
                  <ClockIcon className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>
                    You can check your position in the queue anytime
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <CheckCircleIcon className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>
                    Please arrive at the shop when it's your turn
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 text-gray-300">
                  <CalendarIcon className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>
                    Please arrive 5-10 minutes before your appointment time
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <CheckCircleIcon className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>
                    You'll receive a confirmation call if we have your phone number
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 mb-8">
          <h3 className="text-gold font-bold text-lg mb-4">Important Information</h3>
          <div className="space-y-2 text-gray-300">
            {isQueue ? (
              <>
                <p>• Queue positions update in real-time</p>
                <p>• Estimated wait times are approximate</p>
                <p>• Please stay nearby when you're next in line</p>
                <p>• You can leave the queue by calling us</p>
              </>
            ) : (
              <>
                <p>• Please arrive on time for your appointment</p>
                <p>• Late arrivals may need to reschedule</p>
                <p>• Call us if you need to cancel or reschedule</p>
                <p>• Bring your confirmation number</p>
              </>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {isQueue ? (
            <>
              <Link
                href="/queue"
                className="bg-gold hover:bg-gold-dark text-black px-6 py-3 rounded-lg font-bold text-center transition-colors"
              >
                Check Queue Status
              </Link>
              <Link
                href="/booking"
                className="bg-transparent border border-gold text-gold hover:bg-gold hover:text-black px-6 py-3 rounded-lg font-bold text-center transition-colors"
              >
                Book Appointment Instead
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/booking"
                className="bg-gold hover:bg-gold-dark text-black px-6 py-3 rounded-lg font-bold text-center transition-colors"
              >
                Book Another Appointment
              </Link>
              <Link
                href="/queue/join"
                className="bg-transparent border border-gold text-gold hover:bg-gold hover:text-black px-6 py-3 rounded-lg font-bold text-center transition-colors"
              >
                Join Queue
              </Link>
            </>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-gold hover:text-gold-light transition-colors underline text-lg"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
