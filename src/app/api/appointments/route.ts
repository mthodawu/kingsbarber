import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Appointment } from '@/models/Appointment';

function generateConfirmationNumber(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { customerName, customerPhone, service, date, time, barberId, notes } = await request.json();

    if (!customerName || !customerPhone || !service || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const confirmationNumber = generateConfirmationNumber();

    const appointment = new Appointment({
      customerName,
      customerPhone,
      service,
      date: new Date(date),
      time,
      barberId: barberId || null,
      confirmationNumber,
      notes: notes || '',
    });

    await appointment.save();

    return NextResponse.json({
      success: true,
      appointment: {
        ...appointment.toObject(),
        _id: appointment._id.toString(),
      }
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    const appointments = await Appointment.find({
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('barberId', 'name')
    .sort({ date: 1, time: 1 });

    return NextResponse.json({
      success: true,
      appointments: appointments.map(apt => ({
        ...apt.toObject(),
        _id: apt._id.toString(),
      }))
    });
  } catch (error) {
    console.error('Fetch appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}
