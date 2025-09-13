import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const restaurant = await Restaurant.findOne({ 
      _id: params.id, 
      isActive: true 
    });
    
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    // Convert coordinates from GeoJSON [lng, lat] to {lat, lng} for frontend
    const restaurantData = restaurant.toObject();
    if (restaurantData.location && 
        restaurantData.location.coordinates && 
        restaurantData.location.coordinates.coordinates &&
        Array.isArray(restaurantData.location.coordinates.coordinates)) {
      const [lng, lat] = restaurantData.location.coordinates.coordinates;
      restaurantData.location.coordinates = { lat, lng };
    }
    
    return NextResponse.json(restaurantData);
  } catch (error) {
    console.error('Get restaurant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
