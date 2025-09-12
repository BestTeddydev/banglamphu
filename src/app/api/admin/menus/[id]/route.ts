import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Menu from '@/models/Menu';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      
      const menu = await Menu.findById(params.id).populate('restaurantId', 'name');
      
      if (!menu) {
        return NextResponse.json(
          { error: 'Menu not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        menu
      });
    } catch (error) {
      console.error('Get menu error:', error);
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
      
      const menu = await Menu.findByIdAndUpdate(
        params.id,
        body,
        { new: true, runValidators: true }
      ).populate('restaurantId', 'name');
      
      if (!menu) {
        return NextResponse.json(
          { error: 'Menu not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Menu updated successfully',
        menu
      });
    } catch (error) {
      console.error('Update menu error:', error);
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
      
      const menu = await Menu.findByIdAndDelete(params.id);
      
      if (!menu) {
        return NextResponse.json(
          { error: 'Menu not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Menu deleted successfully'
      });
    } catch (error) {
      console.error('Delete menu error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}
