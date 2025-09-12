import mongoose, { Document, Schema } from 'mongoose';

export interface IMenu extends Document {
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  calories?: number;
  rating: number;
  order: number; // for sorting menu items
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main_course', 'dessert', 'beverage', 'soup', 'salad', 'side_dish', 'other']
  },
  images: [{
    type: String,
    required: true
  }],
  ingredients: [{
    type: String,
    maxlength: 50
  }],
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'eggs', 'soy', 'gluten', 'shellfish', 'fish', 'sesame']
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    required: true,
    min: 1,
    max: 300 // max 5 hours
  },
  calories: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
MenuSchema.index({ restaurantId: 1, category: 1, isAvailable: 1 });
MenuSchema.index({ restaurantId: 1, order: 1 });
MenuSchema.index({ price: 1 });
MenuSchema.index({ rating: -1 });

export default mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);
