import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';
      
      const query = search 
        ? { 
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } }
            ]
          }
        : {};
      
      const stories = await Story.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      const total = await Story.countDocuments(query);
      
      return NextResponse.json({
        stories,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      console.error('Get stories error:', error);
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
      
      const story = new Story(body);
      await story.save();
      
      return NextResponse.json({
        message: 'Story created successfully',
        story
      }, { status: 201 });
    } catch (error) {
      console.error('Create story error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}
