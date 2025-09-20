import mongoose, { Document, Schema } from 'mongoose';

export interface IResearch extends Document {
  title: string;
  description?: string;
  authors?: string[];
  abstract?: string;
  keywords?: string[];
  pdfFile: string;
  category?: string;
  year?: number;
  isActive: boolean;
  order: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResearchSchema = new Schema<IResearch>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  authors: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  abstract: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  keywords: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  pdfFile: {
    type: String,
    required: true
  },
  category: {
    type: String,
    trim: true,
    maxlength: 100
  },
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear() + 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
ResearchSchema.index({ isActive: 1, order: 1 });
ResearchSchema.index({ publishedAt: -1 });
ResearchSchema.index({ category: 1 });
ResearchSchema.index({ year: -1 });
ResearchSchema.index({ keywords: 1 });

export default mongoose.models.Research || mongoose.model<IResearch>('Research', ResearchSchema);
