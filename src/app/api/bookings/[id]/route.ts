import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const booking = await Booking.findById(params.id)
      .populate('packageId', 'name price images category')
      .populate('userId', 'name email');
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    .populate('packageId', 'name price images category')
     .populate('userId', 'name email');
    
    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // คืนจำนวนที่ว่าง
    const Package = require('@/models/Package').default;
    await Package.findByIdAndUpdate(booking.packageId, {
      $inc: { 'tourDates.$[elem].availableSlots': booking.participants }
    }, {
      arrayFilters: [{ 'elem.date': booking.tourDate.date }]
    });
    
    await Booking.findByIdAndDelete(params.id);
    
    return NextResponse.json({
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};