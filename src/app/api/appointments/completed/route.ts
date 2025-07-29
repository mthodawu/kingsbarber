import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Appointment } from '@/models/Appointment';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lt: new Date(endDate)
        }
      };
    }

    const appointments = await Appointment.find({
      ...dateFilter,
      status: 'completed'
    })
    .populate('barberId', 'name')
    .sort({ date: -1, time: -1 });

    return NextResponse.json({
      success: true,
      appointments: appointments.map(apt => ({
        ...apt.toObject(),
        _id: apt._id.toString(),
      }))
    });
  } catch (error) {
    console.error('Fetch completed appointments error:', error);
    return NextResponse.json({ error: 'Failed to fetch completed appointments' }, { status: 500 });
  }
}
