import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import mongoose from 'mongoose';

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const packages = await Package.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Package.countDocuments(query);
    
    return NextResponse.json({
      packages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get packages error:', error);
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
    
    // ตรวจสอบและแปลง attractions และ restaurants เป็น ObjectId
    const processedData = {
      ...body,
      attractions: body.attractions && body.attractions.length > 0 
        ? body.attractions.map((id: string) => new mongoose.Types.ObjectId(id))
        : [],
      restaurants: body.restaurants && body.restaurants.length > 0 
        ? body.restaurants.map((id: string) => new mongoose.Types.ObjectId(id))
        : [],
      images: body.images || []
    };
    
    const packageData = new Package(processedData);
    await packageData.save();
    
    return NextResponse.json({
      message: 'Package created successfully',
      package: packageData
    }, { status: 201 });
  } catch (error) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};