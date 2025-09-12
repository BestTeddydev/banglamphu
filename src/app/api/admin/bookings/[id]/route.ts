import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Package from '@/models/Package';
import User from '@/models/User';
import mongoose from 'mongoose';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    // Ensure models are registered
    const PackageModel = mongoose.models.Package || Package;
    const UserModel = mongoose.models.User || User;
    
    const booking = await Booking.findById(params.id)
      .populate({
        path: 'packageId',
        model: PackageModel,
        select: 'name price images category'
      })
      .populate({
        path: 'userId',
        model: UserModel,
        select: 'name email'
      });
    
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
};

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('Update booking request:', { id: params.id, body });
    
    const booking = await Booking.findById(params.id);
    if (!booking) {
      console.log('Booking not found:', params.id);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    console.log('Found booking:', booking._id);
    
    // อัพเดทเฉพาะฟิลด์ที่ส่งมา
    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus;
    if (body.notes !== undefined) updateData.notes = body.notes;
    
    console.log('Update data:', updateData);
    
    // Ensure models are registered
    const PackageModel = mongoose.models.Package || Package;
    const UserModel = mongoose.models.User || User;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'packageId',
      model: PackageModel,
      select: 'name price images category'
    })
    .populate({
      path: 'userId',
      model: UserModel,
      select: 'name email'
    });
    
    console.log('Updated booking:', updatedBooking?._id);
    
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
    
    await Booking.findByIdAndDelete(params.id);
    
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
};