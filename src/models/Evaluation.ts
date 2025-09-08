import mongoose, { Document, Schema } from 'mongoose';

export interface IEvaluation extends Document {
  userId: mongoose.Types.ObjectId;
  targetType: 'attraction' | 'restaurant' | 'package';
  targetId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  images?: string[];
  isActive: boolean;
}

const EvaluationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['attraction', 'restaurant', 'package']
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Evaluation || mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);