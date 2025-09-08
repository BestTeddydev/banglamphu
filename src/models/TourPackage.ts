import mongoose, { Document, Schema } from 'mongoose';

export interface ITourPackage extends Document {
  name: string;
  description: string;
  images: string[];
  attractions: mongoose.Types.ObjectId[];
  restaurants: mongoose.Types.ObjectId[];
  activities: mongoose.Types.ObjectId[];
  duration: number; // in hours
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  includes: string[];
  excludes: string[];
  meetingPoint: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  meetingTime: string;
  qrCode?: string;
  isActive: boolean;
  tags: string[];
}

const TourPackageSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    trim: true
  }],
  attractions: [{
    type: Schema.Types.ObjectId,
    ref: 'Attraction'
  }],
  restaurants: [{
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  activities: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
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
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0
  },
  includes: [{
    type: String,
    trim: true
  }],
  excludes: [{
    type: String,
    trim: true
  }],
  meetingPoint: {
    address: {
      type: String,
      required: true,
      trim: true
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
  meetingTime: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

export default mongoose.models.TourPackage || mongoose.model<ITourPackage>('TourPackage', TourPackageSchema);
