import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  description: string;
  duration: number; // in hours
  price: number;
  maxParticipants: number;
  includes: string[];
  itinerary: {
    time: string;
    activity: string;
    location: string;
  }[];
  attractions: mongoose.Types.ObjectId[];
  restaurants: mongoose.Types.ObjectId[];
  images: string[];
  category: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

const PackageSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  includes: [{
    type: String,
    maxlength: 200
  }],
  itinerary: [{
    time: { type: String, required: true },
    activity: { type: String, required: true },
    location: { type: String, required: true }
  }],
  attractions: [{
    type: Schema.Types.ObjectId,
    ref: 'Attraction'
  }],
  restaurants: [{
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['วัฒนธรรม', 'ธรรมชาติ', 'อาหาร', 'ประวัติศาสตร์', 'ผจญภัย', 'อื่นๆ']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'moderate', 'hard']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
