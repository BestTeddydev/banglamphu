import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  cuisine: string[];
  priceRange: 'budget' | 'moderate' | 'expensive';
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  facilities: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  averagePrice: number;
}

const RestaurantSchema: Schema = new Schema({
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
  location: {
    address: {
      type: String,
      required: true,
      maxlength: 500
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  images: [{
    type: String,
    required: true
  }],
  cuisine: [{
    type: String,
    required: true,
    maxlength: 50
  }],
  priceRange: {
    type: String,
    required: true,
    enum: ['budget', 'moderate', 'expensive']
  },
  openingHours: {
    monday: { type: String, default: '08:00-22:00' },
    tuesday: { type: String, default: '08:00-22:00' },
    wednesday: { type: String, default: '08:00-22:00' },
    thursday: { type: String, default: '08:00-22:00' },
    friday: { type: String, default: '08:00-22:00' },
    saturday: { type: String, default: '08:00-22:00' },
    sunday: { type: String, default: '08:00-22:00' }
  },
  contact: {
    phone: { type: String, maxlength: 20 },
    email: { type: String, maxlength: 100 },
    website: { type: String, maxlength: 200 }
  },
  facilities: [{
    type: String,
    maxlength: 100
  }],
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
  },
  averagePrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);