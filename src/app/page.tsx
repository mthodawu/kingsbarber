import Link from 'next/link';
import { ClockIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80')"
          }}
        ></div>
        
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-black font-bold text-4xl">K</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              King's <span className="text-gold">Barber</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Premium Grooming Experience Since 1985
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/queue"
              className="bg-gold hover:bg-gold-dark text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Join Queue
            </Link>
            <Link
              href="/booking"
              className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Shop Info Section */}
      <div className="py-16 bg-card">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gold mb-12">
            Visit Our Shop
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <MapPinIcon className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                  <p className="text-gray-300">
                    123 Main Street<br />
                    Downtown City, ST 12345
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <PhoneIcon className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Contact</h3>
                  <p className="text-gray-300">
                    (555) 123-4567<br />
                    info@kingsbarber.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <ClockIcon className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Hours</h3>
                  <div className="text-gray-300 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p>Saturday: 8:00 AM - 6:00 PM</p>
                    <p>Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
                alt="King's Barber Shop Interior"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gold mb-12">
            Our Services
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Classic Haircut', time: '30 min', desc: 'Traditional cuts with modern flair' },
              { name: 'Beard Trim', time: '20 min', desc: 'Precision trimming and shaping' },
              { name: 'Full Service', time: '45 min', desc: 'Haircut and beard trim combo' },
              { name: 'Hot Towel Shave', time: '25 min', desc: 'Traditional straight razor shave' },
              { name: 'Hair Styling', time: '35 min', desc: 'Special occasion styling' },
              { name: 'Consultation', time: '15 min', desc: 'Style advice and planning' },
            ].map((service, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border border-border hover:border-gold transition-colors">
                <h3 className="text-xl font-bold text-gold mb-2">{service.name}</h3>
                <p className="text-gold-dark font-medium mb-3">{service.time}</p>
                <p className="text-gray-300">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
