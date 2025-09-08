import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  imageUrl?: string;
  category: 'general' | 'event' | 'announcement' | 'community';
  isPublished: boolean;
  views: number;
  tags: string[];
}

const NewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'event', 'announcement', 'community'],
    default: 'general'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
