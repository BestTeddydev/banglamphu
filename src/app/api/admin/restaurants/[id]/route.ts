import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { requireAdmin } from '@/lib/auth';

export const GET = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const restaurant = await Restaurant.findById(params.id);
    
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error('Get restaurant error:', error);
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
});

export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
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
});
