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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let filter: any = {};
    
    // Default filter for upcoming appointments if no specific filters provided
    if (!status && !startDate && !endDate) {
      filter = {
        date: { $gte: new Date() },
        status: { $in: ['pending', 'confirmed', 'in-progress'] }
      };
    } else {
      // Apply specific filters
      if (status) {
        filter.status = status;
      }
      
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        };
      } else if (startDate) {
        filter.date = { $gte: new Date(startDate) };
      } else if (endDate) {
        filter.date = { $lt: new Date(endDate) };
      }
    }
    
    const appointments = await Appointment.find(filter)
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

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('barberId', 'name');

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      appointment: {
        ...appointment.toObject(),
        _id: appointment._id.toString(),
      }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
