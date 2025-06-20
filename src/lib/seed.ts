import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { Barber } from '@/models/Barber';

export async function seedDatabase() {
  try {
    await dbConnect();
    
    // Check if demo barber already exists
    const existingBarber = await Barber.findOne({ email: 'demo@kingsbarber.com' });
    
    if (!existingBarber) {
      const hashedPassword = await bcrypt.hash('demo123', 12);
      
      const demoBarber = new Barber({
        name: 'Demo Barber',
        email: 'demo@kingsbarber.com',
        password: hashedPassword,
        isActive: true,
      });
      
      await demoBarber.save();
      console.log('Demo barber created successfully');
    } else {
      console.log('Demo barber already exists');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
