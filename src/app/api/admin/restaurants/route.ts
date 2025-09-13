import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      
      const { searchParams } = new URL(req.url);
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
      
    const restaurants = await Restaurant.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // Convert coordinates from GeoJSON [lng, lat] to {lat, lng} for frontend
    const restaurantsData = (restaurants || []).map(restaurant => {
      const restaurantData = restaurant.toObject();
      if (restaurantData.location && 
          restaurantData.location.coordinates && 
          restaurantData.location.coordinates.coordinates &&
          Array.isArray(restaurantData.location.coordinates.coordinates)) {
        const [lng, lat] = restaurantData.location.coordinates.coordinates;
        restaurantData.location.coordinates = { lat, lng };
      }
      return restaurantData;
    });
      
      const total = await Restaurant.countDocuments(query);
      
      return NextResponse.json({
        restaurants: restaurantsData,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      console.error('Get restaurants error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}

export async function POST(request: NextRequest) {
  return requireAdmin(async (req: NextRequest) => {
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
  })(request);
}