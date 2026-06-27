import mongoose, { Schema } from 'mongoose';
import { IFavorite } from '../interfaces';

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as any,
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    } as any,
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', favoriteSchema);
