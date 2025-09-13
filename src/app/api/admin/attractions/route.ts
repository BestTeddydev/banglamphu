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
    
    // Convert coordinates from GeoJSON [lng, lat] to {lat, lng} for frontend
    const attractionsData = (attractions || []).map(attraction => {
      const attractionData = attraction.toObject();
      if (attractionData.location && 
          attractionData.location.coordinates && 
          attractionData.location.coordinates.coordinates &&
          Array.isArray(attractionData.location.coordinates.coordinates)) {
        const [lng, lat] = attractionData.location.coordinates.coordinates;
        attractionData.location.coordinates = { lat, lng };
      }
      return attractionData;
    });
    
    const total = await Attraction.countDocuments(query);
    
    return NextResponse.json({
      attractions: attractionsData,
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
    
    // Convert coordinates from {lat, lng} to GeoJSON format [lng, lat]
    if (body.location && body.location.coordinates) {
      const { lat, lng } = body.location.coordinates;
      body.location.coordinates = {
        type: 'Point',
        coordinates: [lng, lat] // MongoDB expects [longitude, latitude]
      };
    }
    
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
