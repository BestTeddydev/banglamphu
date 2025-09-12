import mongoose, { Document, Schema } from 'mongoose';

export interface IStoryPage {
  pageNumber: number;
  image: string;
  text: string;
  title?: string;
}

export interface IStory extends Document {
  title: string;
  description: string;
  coverImage: string;
  pages: IStoryPage[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StoryPageSchema = new Schema({
  pageNumber: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  title: {
    type: String,
    maxlength: 100
  }
}, { _id: false });

const StorySchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  coverImage: {
    type: String,
    required: true
  },
  pages: [StoryPageSchema],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
StorySchema.index({ isPublished: 1, createdAt: -1 });
StorySchema.index({ 'pages.pageNumber': 1 });

// Ensure page numbers are unique within a story
StorySchema.pre('save', function(next) {
  if (this.isModified('pages')) {
    const pageNumbers = this.pages.map(page => page.pageNumber);
    const uniquePageNumbers = [...new Set(pageNumbers)];
    
    if (pageNumbers.length !== uniquePageNumbers.length) {
      return next(new Error('Page numbers must be unique within a story'));
    }
    
    // Sort pages by page number
    this.pages.sort((a, b) => a.pageNumber - b.pageNumber);
  }
  next();
});

export default mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);
