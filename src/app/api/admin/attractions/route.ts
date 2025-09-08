import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attraction from '@/models/Attraction';
import { requireAdmin } from '@/lib/auth';

export const GET = requireAdmin(async (request: NextRequest) => {
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
    
    const attractions = await Attraction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Attraction.countDocuments(query);
    
    return NextResponse.json({
      attractions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get attractions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const attraction = new Attraction(body);
    await attraction.save();
    
    return NextResponse.json({
      message: 'Attraction created successfully',
      attraction
    }, { status: 201 });
  } catch (error) {
    console.error('Create attraction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
