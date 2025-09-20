import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  description?: string;
  link: string;
  source?: string;
  category?: string;
  isActive: boolean;
  order: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    trim: true,
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
NewsSchema.index({ isActive: 1, order: 1 });
NewsSchema.index({ publishedAt: -1 });
NewsSchema.index({ category: 1 });

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);