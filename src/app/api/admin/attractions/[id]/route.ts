import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attraction from '@/models/Attraction';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAdmin(async (req: NextRequest, user) => {
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
      console.error('Get attraction error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAdmin(async (req: NextRequest, user) => {
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
      
      const attraction = await Attraction.findByIdAndUpdate(
        params.id,
        body,
        { new: true, runValidators: true }
      );
      
      if (!attraction) {
        return NextResponse.json(
          { error: 'Attraction not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Attraction updated successfully',
        attraction
      });
    } catch (error) {
      console.error('Update attraction error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAdmin(async (req: NextRequest, user) => {
    try {
      await connectDB();
      
      const attraction = await Attraction.findByIdAndDelete(params.id);
      
      if (!attraction) {
        return NextResponse.json(
          { error: 'Attraction not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Attraction deleted successfully'
      });
    } catch (error) {
      console.error('Delete attraction error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}
