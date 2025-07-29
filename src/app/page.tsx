import Link from "next/link";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80')",
          }}
        ></div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2zm0 12c-1.1 0-2-.89-2-2s.89-2 2-2 2 .89 2 2-.89 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3h-3z"/>
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              King&apos;s <span className="text-gold">Barber</span>
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
      <div className="py-16 ">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gold mb-12">
            Visit Our Shop
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <MapPinIcon className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Location
                  </h3>
                  <p className="text-gray-300">
                    123 Main Street
                    <br />
                    Makhanda (Grahamstown)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <PhoneIcon className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Contact
                  </h3>
                  <p className="text-gray-300">
                    (555) 123-4567
                    <br />
                    info@kingsbarber.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <ClockIcon className="h-6 w-6 text-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Hours
                  </h3>
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
                className="rounded-lg shadow-lg "
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
              {
                name: "Classic Haircut",
                time: "30 min",
                desc: "Traditional cuts with modern flair",
                image:
                  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                alt: "Black man getting a classic haircut",
              },
              {
                name: "Beard Trim",
                time: "20 min",
                desc: "Precision trimming and shaping",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                alt: "Middle Eastern man getting beard trim",
              },
              {
                name: "Full Service",
                time: "45 min",
                desc: "Haircut and beard trim combo",
                image:
                  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                alt: "Asian man receiving full service grooming",
              },
              // {
              //   name: 'Hot Towel Shave',
              //   time: '25 min',
              //   desc: 'Traditional straight razor shave',
              //   image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              //   alt: 'White man receiving hot towel shave'
              // },
              // {
              //   name: 'Hair Styling',
              //   time: '35 min',
              //   desc: 'Special occasion styling',
              //   image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              //   alt: 'Hispanic man getting hair styled'
              // },
              // {
              //   name: 'Consultation',
              //   time: '15 min',
              //   desc: 'Style advice and planning',
              //   image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              //   alt: 'Diverse men discussing haircut consultation'
              // },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border hover:border-gold transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80"></div>
                  <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-full text-sm font-bold">
                    {service.time}
                  </div>
                  <div className="p-2 bg-card/10  absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent  to-black">
                    <h3 className="text-xl font-bold text-gold mb-2 text-shadow-md text-shadow-black/50">
                      {service.name}
                    </h3>
                    <p className="text-white">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
