import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TourPackage from '@/models/TourPackage';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const packages = await TourPackage.find({ isActive: true })
      .populate('attractions')
      .populate('restaurants')
      .populate('activities')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await TourPackage.countDocuments({ isActive: true });
    
    return NextResponse.json({
      packages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const tourPackage = new TourPackage(body);
    await tourPackage.save();
    
    return NextResponse.json(tourPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}
