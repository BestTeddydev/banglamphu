import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/auth';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const packageData = await Package.findById(params.id)
      // .populate('attractions', 'name')
      // .populate('restaurants', 'name');
    
    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ package: packageData });
  } catch (error) {
    console.error('Get package error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // ตรวจสอบและแปลง attractions และ restaurants เป็น ObjectId
    const processedData = {
      ...body,
      attractions: body.attractions && body.attractions.length > 0 
        ? body.attractions.map((id: string) => new mongoose.Types.ObjectId(id))
        : [],
      restaurants: body.restaurants && body.restaurants.length > 0 
        ? body.restaurants.map((id: string) => new mongoose.Types.ObjectId(id))
        : [],
      images: body.images || []
    };
    
    const packageData = await Package.findByIdAndUpdate(
      params.id,
      processedData,
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    console.log('Attempting to delete package with ID:', params.id);
    await connectDB();
    
    // ตรวจสอบว่า package มีอยู่หรือไม่ก่อนลบ
    const existingPackage = await Package.findById(params.id);
    if (!existingPackage) {
      console.log('Package not found:', params.id);
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    console.log('Package found, proceeding with deletion:', existingPackage.name);
    
    const packageData = await Package.findByIdAndDelete(params.id);
    
    if (!packageData) {
      console.log('Package deletion failed');
      return NextResponse.json(
        { error: 'Failed to delete package' },
        { status: 500 }
      );
    }
    
    console.log('Package deleted successfully:', packageData.name);
    return NextResponse.json({
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Unknown';
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};
