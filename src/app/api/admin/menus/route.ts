import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Menu from '@/models/Menu';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      
      const { searchParams } = new URL(request.url);
      const restaurantId = searchParams.get('restaurantId');
      const category = searchParams.get('category');
      const isAvailable = searchParams.get('isAvailable');
      
      let query: any = {};
      
      if (restaurantId) {
        query.restaurantId = restaurantId;
      }
      
      if (category) {
        query.category = category;
      }
      
      if (isAvailable !== null) {
        query.isAvailable = isAvailable === 'true';
      }
      
      const menus = await Menu.find(query)
        .populate('restaurantId', 'name')
        .sort({ order: 1, createdAt: -1 });
      
      return NextResponse.json({
        success: true,
        menus
      });
    } catch (error) {
      console.error('Get menus error:', error);
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
      
      // Validate required fields
      if (!body.restaurantId || !body.name || !body.description || !body.price || !body.category) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
      
      const menu = new Menu(body);
      await menu.save();
      
      return NextResponse.json({
        success: true,
        message: 'Menu created successfully',
        menu
      }, { status: 201 });
    } catch (error) {
      console.error('Create menu error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}
