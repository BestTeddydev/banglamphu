import mongoose, { Document, Schema } from 'mongoose';

export interface IHighlight extends Document {
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  category?: string;
  tags?: string[];
  viewCount?: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HighlightSchema = new Schema<IHighlight>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  thumbnail: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    trim: true,
    maxlength: 20
  },
  category: {
    type: String,
    trim: true,
    maxlength: 100
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
HighlightSchema.index({ isActive: 1, order: 1 });
HighlightSchema.index({ category: 1 });
HighlightSchema.index({ createdAt: -1 });
HighlightSchema.index({ viewCount: -1 });

export default mongoose.models.Highlight || mongoose.model<IHighlight>('Highlight', HighlightSchema);
