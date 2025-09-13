import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attraction from '@/models/Attraction';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};