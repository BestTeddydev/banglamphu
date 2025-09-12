import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Package from '@/models/Package';
import mongoose from 'mongoose';

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const query: any = {};
    if (userId) query.userId = new mongoose.Types.ObjectId(userId);
    if (status) query.status = status;
    
    const bookings = await Booking.find(query)
      .populate('packageId', 'name price images category')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Booking.countDocuments(query);
    
    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // ตรวจสอบว่าแพ็คเกจมีอยู่และมีที่ว่าง
    const packageData = await Package.findById(body.packageId);
    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    // ตรวจสอบวันที่ทัวร์
    const tourDate = packageData.tourDates.find((td:any) => {
      const dateStr = td.date instanceof Date 
        ? td.date.toISOString().split('T')[0]
        : new Date(td.date).toISOString().split('T')[0];
      return dateStr === body.tourDate.date;
    });
    
    if (!tourDate) {
      return NextResponse.json(
        { error: 'Tour date not available' },
        { status: 400 }
      );
    }
    
    if (tourDate.availableSlots < body.participants) {
      return NextResponse.json(
        { error: 'Not enough available slots' },
        { status: 400 }
      );
    }
    
    // สร้างการจอง
    const bookingData = new Booking({
      ...body,
      packageId: new mongoose.Types.ObjectId(body.packageId),
      userId: new mongoose.Types.ObjectId(body.userId),
      totalPrice: packageData.price * body.participants,
      tourDate: {
        date: new Date(body.tourDate.date),
        startTime: tourDate.startTime,
        endTime: tourDate.endTime
      }
    });
    
    await bookingData.save();
    
    // อัพเดทจำนวนที่ว่าง
    await Package.findByIdAndUpdate(body.packageId, {
      $inc: { 'tourDates.$[elem].availableSlots': -body.participants }
    }, {
      arrayFilters: [{ 'elem.date': new Date(body.tourDate.date) }]
    });
    
    return NextResponse.json({
      message: 'Booking created successfully',
      booking: bookingData
    }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};