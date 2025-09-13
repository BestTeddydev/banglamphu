import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attraction from '@/models/Attraction';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const attraction = await Attraction.findById(params.id);
    
    if (!attraction) {
      return NextResponse.json(
        { error: 'Attraction not found' },
        { status: 404 }
      );
    }
    
    // Convert coordinates from GeoJSON [lng, lat] to {lat, lng} for frontend
    const attractionData = attraction.toObject();
    if (attractionData.location && 
        attractionData.location.coordinates && 
        attractionData.location.coordinates.coordinates &&
        Array.isArray(attractionData.location.coordinates.coordinates)) {
      const [lng, lat] = attractionData.location.coordinates.coordinates;
      attractionData.location.coordinates = { lat, lng };
    }
    
    return NextResponse.json(attractionData);
  } catch (error) {
    console.error('Error fetching attraction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attraction' },
      { status: 500 }
    );
  }
}
