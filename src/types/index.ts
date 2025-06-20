import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

export interface ServiceOption {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface QueueEntry {
  _id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  position: number;
  estimatedWait: number;
  status: 'waiting' | 'in-progress' | 'completed' | 'left';
  confirmationNumber: string;
  joinedAt: Date;
}

export interface AppointmentEntry {
  _id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  barberId?: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmationNumber: string;
  notes?: string;
}
