# King's Barber - Mobile-First Barbershop Web Application

A modern, mobile-first web application built with Next.js 14 for barbershop queue management and appointment booking.

## Features

### Customer Features
- **Mobile-first responsive design** with dark and gold theme
- **Queue management** - Join queue and check real-time status
- **Appointment booking** - Calendar-based scheduling system
- **Service selection** - Various barbershop services
- **Confirmation system** - Unique confirmation numbers for tracking

### Barber Features
- **Authentication system** - Secure login for barbers only
- **Dashboard** - Overview of daily operations
- **Queue management** - Manage customer queue in real-time
- **Appointment management** - View and manage bookings

## Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js (barbers only)
- **UI Components**: Headless UI, Heroicons, Lucide React
- **Styling**: TailwindCSS with dark and gold theme
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kingsbarber
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/kingsbarber
   NEXTAUTH_SECRET=your-secure-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Generate NextAuth secret**
   ```bash
   openssl rand -base64 32
   ```

5. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

6. **Seed the database** (creates demo barber account)
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Credentials

**Barber Login:**
- Email: `demo@kingsbarber.com`
- Password: `demo123`

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth configuration
│   │   ├── appointments/  # Appointment management
│   │   ├── queue/         # Queue management
│   │   └── barbers/       # Barber data
│   ├── barber/            # Barber-only pages
│   │   ├── login/         # Barber authentication
│   │   └── dashboard/     # Barber dashboard
│   ├── booking/           # Appointment booking
│   ├── queue/             # Queue management
│   └── confirmation/      # Booking confirmations
├── components/            # Reusable components
├── lib/                   # Utility functions
├── models/                # MongoDB schemas
└── types/                 # TypeScript definitions
```

## API Endpoints

### Public Endpoints
- `GET /api/queue` - Get current queue status
- `POST /api/queue` - Join the queue
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Book an appointment
- `GET /api/barbers` - Get available barbers

### Authentication
- `POST /api/auth/signin` - Barber login
- `POST /api/auth/signout` - Barber logout

### Admin
- `POST /api/seed` - Seed database with demo data

## Database Models

### Barber
- Name, email, password (hashed)
- Active status

### Queue
- Customer info, service type
- Position, estimated wait time
- Status, confirmation number

### Appointment  
- Customer info, service type
- Date, time, barber assignment
- Status, confirmation number, notes

## Deployment

### Environment Variables for Production
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kingsbarber
NEXTAUTH_SECRET=secure-random-string
NEXTAUTH_URL=https://yourdomain.com
```

### Build for Production
```bash
npm run build
npm start
```

## Features in Detail

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Touch-friendly interface elements
- Fast loading and smooth animations

### Queue System
- Real-time queue position tracking
- Estimated wait time calculations
- Automatic position updates

### Appointment Booking
- Calendar-based date selection
- Time slot availability
- Barber preference selection
- Service duration consideration

### Dark & Gold Theme
- Professional barbershop aesthetic
- High contrast for accessibility
- Consistent branding throughout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact info@kingsbarber.com or create an issue in the repository.
