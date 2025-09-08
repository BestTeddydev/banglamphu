import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';
import Attraction from '@/models/Attraction';
import Restaurant from '@/models/Restaurant';
import Package from '@/models/Package';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export const GET = requireAdmin(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const targetType = searchParams.get('targetType') || '';
    const rating = searchParams.get('rating') || '';
    
    const query: any = {};
    
    if (targetType) {
      query.targetType = targetType;
    }
    
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    const evaluations = await Evaluation.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Get target names
    const evaluationsWithTargets = await Promise.all(
      evaluations.map(async (evaluation) => {
        let targetName = '';
        if (evaluation.targetType === 'attraction') {
          const attraction = await Attraction.findById(evaluation.targetId);
          targetName = attraction?.name || 'ไม่พบข้อมูล';
        } else if (evaluation.targetType === 'restaurant') {
          const restaurant = await Restaurant.findById(evaluation.targetId);
          targetName = restaurant?.name || 'ไม่พบข้อมูล';
        } else if (evaluation.targetType === 'package') {
          const packageData = await Package.findById(evaluation.targetId);
          targetName = packageData?.name || 'ไม่พบข้อมูล';
        }
        
        return {
          ...evaluation.toObject(),
          targetName
        };
      })
    );
    
    const total = await Evaluation.countDocuments(query);
    
    return NextResponse.json({
      evaluations: evaluationsWithTargets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get evaluations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    const evaluation = await Evaluation.findByIdAndDelete(params.id);
    
    if (!evaluation) {
      return NextResponse.json(
        { error: 'Evaluation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Evaluation deleted successfully'
    });
  } catch (error) {
    console.error('Delete evaluation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
