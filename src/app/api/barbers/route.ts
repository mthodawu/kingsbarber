import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Barber } from '@/models/Barber';

export async function GET() {
  try {
    await dbConnect();
    
    const barbers = await Barber.find({ isActive: true })
      .select('name _id')
      .sort({ name: 1 });

    return NextResponse.json({
      success: true,
      barbers: barbers.map(barber => ({
        _id: barber._id.toString(),
        name: barber.name,
      }))
    });
  } catch (error) {
    console.error('Fetch barbers error:', error);
    return NextResponse.json({ error: 'Failed to fetch barbers' }, { status: 500 });
  }
}
