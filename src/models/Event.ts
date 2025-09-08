import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizer: string;
  contactInfo: string;
  imageUrl?: string;
  maxParticipants?: number;
  currentParticipants: number;
  registrationRequired: boolean;
  isActive: boolean;
  category: 'cultural' | 'sports' | 'education' | 'social' | 'religious';
  tags: string[];
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  organizer: {
    type: String,
    required: true,
    trim: true
  },
  contactInfo: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  maxParticipants: {
    type: Number,
    min: 1
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['cultural', 'sports', 'education', 'social', 'religious'],
    default: 'social'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
