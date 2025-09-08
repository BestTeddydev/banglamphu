import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { requireAdmin } from '@/lib/auth';

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine') || '';
    
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }
    
    const restaurants = await Restaurant.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Restaurant.countDocuments(query);
    
    return NextResponse.json({
      restaurants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
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
    
    const restaurant = new Restaurant(body);
    await restaurant.save();
    
    return NextResponse.json({
      message: 'Restaurant created successfully',
      restaurant
    }, { status: 201 });
  } catch (error) {
    console.error('Create restaurant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
