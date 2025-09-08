import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { requireAdmin } from '@/lib/auth';

export const GET = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const booking = await Booking.findById(params.id)
      .populate('packageId', 'name price duration')
      .populate('userId', 'name email phone');
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const PUT = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate('packageId', 'name price').populate('userId', 'name email');
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const booking = await Booking.findByIdAndDelete(params.id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
