import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      
      const restaurant = await Restaurant.findById(params.id);
      
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
  })(request);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      
      const restaurant = await Restaurant.findByIdAndUpdate(
        params.id,
        body,
        { new: true, runValidators: true }
      );
      
      if (!restaurant) {
        return NextResponse.json(
          { error: 'Restaurant not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Restaurant updated successfully',
        restaurant
      });
    } catch (error) {
      console.error('Update restaurant error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      
      const restaurant = await Restaurant.findByIdAndDelete(params.id);
      
      if (!restaurant) {
        return NextResponse.json(
          { error: 'Restaurant not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Restaurant deleted successfully'
      });
    } catch (error) {
      console.error('Delete restaurant error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}