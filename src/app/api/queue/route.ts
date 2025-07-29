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
    
    const queue = await Queue.find({ 
      status: { $in: ['waiting', 'in-progress', 'completed'] }
    })
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

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Queue entry ID is required' }, { status: 400 });
    }

    const queueEntry = await Queue.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!queueEntry) {
      return NextResponse.json({ error: 'Queue entry not found' }, { status: 404 });
    }

    // If status changed to completed or left, update positions
    if (updateData.status === 'completed' || updateData.status === 'left') {
      await reorderQueue();
    }

    return NextResponse.json({
      success: true,
      queueEntry: {
        ...queueEntry.toObject(),
        _id: queueEntry._id.toString(),
      }
    });
  } catch (error) {
    console.error('Update queue error:', error);
    return NextResponse.json({ error: 'Failed to update queue entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Queue entry ID is required' }, { status: 400 });
    }

    const queueEntry = await Queue.findByIdAndDelete(id);

    if (!queueEntry) {
      return NextResponse.json({ error: 'Queue entry not found' }, { status: 404 });
    }

    // Reorder the queue after deletion
    await reorderQueue();

    return NextResponse.json({
      success: true,
      message: 'Queue entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete queue entry error:', error);
    return NextResponse.json({ error: 'Failed to delete queue entry' }, { status: 500 });
  }
}

async function reorderQueue() {
  const waitingEntries = await Queue.find({ status: 'waiting' }).sort({ position: 1 });
  
  for (let i = 0; i < waitingEntries.length; i++) {
    const newPosition = i + 1;
    const estimatedWait = calculateEstimatedWait(newPosition, waitingEntries[i].service);
    
    await Queue.findByIdAndUpdate(waitingEntries[i]._id, {
      position: newPosition,
      estimatedWait
    });
  }
}
