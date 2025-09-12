import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return requireAdmin(async (req: NextRequest) => {
    try {
      await connectDB();
      
      const story = await Story.findById(params.id);
      
      if (!story) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(story);
    } catch (error) {
      console.error('Get story error:', error);
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
      
      const story = await Story.findByIdAndUpdate(
        params.id,
        body,
        { new: true, runValidators: true }
      );
      
      if (!story) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Story updated successfully',
        story
      });
    } catch (error) {
      console.error('Update story error:', error);
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
      
      const story = await Story.findByIdAndDelete(params.id);
      
      if (!story) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: 'Story deleted successfully'
      });
    } catch (error) {
      console.error('Delete story error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}
