import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  repliedAt?: Date;
  replyMessage?: string;
  isPublic: boolean;
}

const ContactSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  repliedAt: {
    type: Date
  },
  replyMessage: {
    type: String,
    maxlength: 2000
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
