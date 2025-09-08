import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  packageId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  participants: number;
  bookingDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  notes?: string;
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
  customerInfo: {
    name: {
      type: String,
      required: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      maxlength: 20
    }
  },
  participants: {
    type: Number,
    required: true,
    min: 1
  },
  bookingDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);