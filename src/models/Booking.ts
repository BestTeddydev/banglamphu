import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  packageId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tourDate: {
    date: Date;
    startTime: string;
    endTime: string;
  };
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash';
  paymentSlip?: string;
  paymentDate?: Date;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    emergencyContact?: string;
    specialRequests?: string;
  };
  notes?: string;
  adminNotes?: string;
}

const BookingSchema: Schema = new Schema({
  packageId: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tourDate: {
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  participants: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'credit_card', 'cash'],
    default: 'bank_transfer'
  },
  paymentSlip: {
    type: String
  },
  paymentDate: {
    type: Date
  },
  contactInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    emergencyContact: {
      type: String,
      trim: true
    },
    specialRequests: {
      type: String,
      maxlength: 500
    }
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Index for efficient queries
BookingSchema.index({ packageId: 1, status: 1 });
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ 'tourDate.date': 1 });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);