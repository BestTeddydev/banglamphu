import mongoose, { Document, Schema } from 'mongoose';

export interface ISouvenir extends Document {
  name: string;
  description?: string;
  images: string[];
  price?: number;
  category?: string;
  material?: string;
  size?: string;
  weight?: string;
  origin?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SouvenirSchema = new Schema<ISouvenir>({
  name: {
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
  images: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    trim: true,
    maxlength: 100
  },
  material: {
    type: String,
    trim: true,
    maxlength: 100
  },
  size: {
    type: String,
    trim: true,
    maxlength: 50
  },
  weight: {
    type: String,
    trim: true,
    maxlength: 50
  },
  origin: {
    type: String,
    trim: true,
    maxlength: 100
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
SouvenirSchema.index({ isActive: 1, order: 1 });
SouvenirSchema.index({ category: 1 });
SouvenirSchema.index({ createdAt: -1 });

export default mongoose.models.Souvenir || mongoose.model<ISouvenir>('Souvenir', SouvenirSchema);
