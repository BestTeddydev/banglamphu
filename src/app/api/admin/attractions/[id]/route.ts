import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attraction from '@/models/Attraction';
import { requireAdmin } from '@/lib/auth';

export const GET = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const attraction = await Attraction.findById(params.id);
    
    if (!attraction) {
      return NextResponse.json(
        { error: 'Attraction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ attraction });
  } catch (error) {
    console.error('Get attraction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const PUT = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
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
});

export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
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
});
