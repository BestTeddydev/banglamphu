import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { requireAdmin } from '@/lib/auth';

export const GET = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const packageData = await Package.findById(params.id)
      .populate('attractions', 'name')
      .populate('restaurants', 'name');
    
    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ package: packageData });
  } catch (error) {
    console.error('Get package error:', error);
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
    
    const packageData = await Package.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate('attractions', 'name').populate('restaurants', 'name');
    
    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Package updated successfully',
      package: packageData
    });
  } catch (error) {
    console.error('Update package error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const packageData = await Package.findByIdAndDelete(params.id);
    
    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
