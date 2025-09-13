import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  category: string;
  location: {
    address: string;
    coordinates: {
      type: 'Point';
      coordinates: [number, number]; // [lng, lat]
    };
  };
  images: string[];
  openingHours: {
    open: string;
    close: string;
  };
  contactInfo: string;
  priceRange: string;
  features: string[];
  tags: string[];
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['thai', 'international', 'cafe', 'street_food', 'fine_dining', 'fast_food', 'seafood', 'other']
  },
  location: {
    address: {
      type: String,
      required: true,
      maxlength: 200
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function(coords: number[]) {
            return coords.length === 2 && 
                   coords[0] >= -180 && coords[0] <= 180 && // lng
                   coords[1] >= -90 && coords[1] <= 90;     // lat
          },
          message: 'Coordinates must be [longitude, latitude]'
        }
      }
    }
  },
  images: [{
    type: String,
    required: true
  }],
  openingHours: {
    open: {
      type: String,
      required: true
    },
    close: {
      type: String,
      required: true
    }
  },
  contactInfo: {
    type: String,
    maxlength: 100
  },
  priceRange: {
    type: String,
    required: true,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  features: [{
    type: String,
    maxlength: 50
  }],
  tags: [{
    type: String,
    maxlength: 30
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
RestaurantSchema.index({ category: 1, isActive: 1 });
RestaurantSchema.index({ 'location.coordinates': '2dsphere' });
RestaurantSchema.index({ rating: -1 });

export default mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);