import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Queue } from '@/models/Queue';

function generateConfirmationNumber(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function calculateEstimatedWait(position: number, service: string): number {
  const baseTimes = {
    'haircut': 30,
    'beard-trim': 20,
    'haircut-beard': 45,
    'shave': 25,
    'styling': 35,
  };
  
  const serviceTime = baseTimes[service as keyof typeof baseTimes] || 30;
  return position * serviceTime;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { customerName, customerPhone, service } = await request.json();

    if (!customerName || !customerPhone || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get current queue position
    const currentQueueCount = await Queue.countDocuments({ status: 'waiting' });
    const position = currentQueueCount + 1;
    
    const estimatedWait = calculateEstimatedWait(position, service);
    const confirmationNumber = generateConfirmationNumber();

    const queueEntry = new Queue({
      customerName,
      customerPhone,
      service,
      position,
      estimatedWait,
      confirmationNumber,
    });

    await queueEntry.save();

    return NextResponse.json({
      success: true,
      queueEntry: {
        ...queueEntry.toObject(),
        _id: queueEntry._id.toString(),
      }
    });
  } catch (error) {
    console.error('Queue join error:', error);
    return NextResponse.json({ error: 'Failed to join queue' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    const queue = await Queue.find({ status: 'waiting' })
      .sort({ position: 1 });

    return NextResponse.json({
      success: true,
      queue: queue.map(entry => ({
        ...entry.toObject(),
        _id: entry._id.toString(),
      }))
    });
  } catch (error) {
    console.error('Fetch queue error:', error);
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
  }
}
