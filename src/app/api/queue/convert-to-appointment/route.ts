import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Queue } from '@/models/Queue';
import { Appointment } from '@/models/Appointment';

function generateConfirmationNumber(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { queueId } = await request.json();

    if (!queueId) {
      return NextResponse.json({ error: 'Queue ID is required' }, { status: 400 });
    }

    // Find the queue entry
    const queueEntry = await Queue.findById(queueId);
    if (!queueEntry) {
      return NextResponse.json({ error: 'Queue entry not found' }, { status: 404 });
    }

    // Create appointment from queue entry
    const now = new Date();
    const appointmentConfirmationNumber = generateConfirmationNumber();

    const appointment = new Appointment({
      customerName: queueEntry.customerName,
      customerPhone: queueEntry.customerPhone,
      service: queueEntry.service,
      date: now,
      time: now.toTimeString().slice(0, 5), // HH:MM format
      status: 'confirmed',
      confirmationNumber: appointmentConfirmationNumber,
      notes: `Converted from queue entry #${queueEntry.confirmationNumber}`,
      barberId: null
    });

    await appointment.save();

    // Update queue entry status to in-progress
    queueEntry.status = 'in-progress';
    await queueEntry.save();

    return NextResponse.json({
      success: true,
      appointment: {
        ...appointment.toObject(),
        _id: appointment._id.toString(),
      },
      queueEntry: {
        ...queueEntry.toObject(),
        _id: queueEntry._id.toString(),
      }
    });
  } catch (error) {
    console.error('Convert to appointment error:', error);
    return NextResponse.json({ error: 'Failed to convert queue entry to appointment' }, { status: 500 });
  }
}
