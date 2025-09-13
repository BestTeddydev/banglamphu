import mongoose, { Document, Schema } from 'mongoose';

export interface IAttraction extends Document {
  name: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      type: 'Point';
      coordinates: [number, number]; // [lng, lat]
    };
  };
  images: string[];
  category: string;
  openingHours: {
    open: string;
    close: string;
  };
  admissionFee: number;
  contactInfo: string;
  features: string[];
  tags: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

const AttractionSchema: Schema = new Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['temple', 'market', 'museum', 'park', 'historical', 'cultural', 'other']
  },
  openingHours: {
    open: { type: String, default: '08:00' },
    close: { type: String, default: '18:00' }
  },
  admissionFee: {
    type: Number,
    default: 0
  },
  contactInfo: {
    type: String,
    maxlength: 200
  },
  features: [{
    type: String,
    maxlength: 100
  }],
  tags: [{
    type: String,
    maxlength: 50
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
  }
}, {
  timestamps: true
});

// Index for better query performance
AttractionSchema.index({ category: 1, isActive: 1 });
AttractionSchema.index({ 'location.coordinates': '2dsphere' });
AttractionSchema.index({ rating: -1 });

export default mongoose.models.Attraction || mongoose.model<IAttraction>('Attraction', AttractionSchema);