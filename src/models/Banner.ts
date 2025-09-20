import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
BannerSchema.index({ isActive: 1, order: 1 });
BannerSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
