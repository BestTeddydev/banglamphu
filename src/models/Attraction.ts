import mongoose, { Document, Schema } from 'mongoose';

export interface IAttraction extends Document {
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
  category: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  admissionFee: {
    adult: number;
    child: number;
    student: number;
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
  category: {
    type: String,
    required: true,
    enum: ['วัด', 'ตลาด', 'พิพิธภัณฑ์', 'สวนสาธารณะ', 'สถานที่ประวัติศาสตร์', 'อื่นๆ']
  },
  openingHours: {
    monday: { type: String, default: '08:00-18:00' },
    tuesday: { type: String, default: '08:00-18:00' },
    wednesday: { type: String, default: '08:00-18:00' },
    thursday: { type: String, default: '08:00-18:00' },
    friday: { type: String, default: '08:00-18:00' },
    saturday: { type: String, default: '08:00-18:00' },
    sunday: { type: String, default: '08:00-18:00' }
  },
  admissionFee: {
    adult: { type: Number, default: 0 },
    child: { type: Number, default: 0 },
    student: { type: Number, default: 0 }
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
  }
}, {
  timestamps: true
});

export default mongoose.models.Attraction || mongoose.model<IAttraction>('Attraction', AttractionSchema);