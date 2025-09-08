import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attraction from '@/models/Attraction';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    
    const query = category ? { category, isActive: true } : { isActive: true };
    
    const attractions = await Attraction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Attraction.countDocuments(query);
    
    return NextResponse.json({
      attractions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching attractions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attractions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const attraction = new Attraction(body);
    await attraction.save();
    
    return NextResponse.json(attraction, { status: 201 });
  } catch (error) {
    console.error('Error creating attraction:', error);
    return NextResponse.json(
      { error: 'Failed to create attraction' },
      { status: 500 }
    );
  }
}
