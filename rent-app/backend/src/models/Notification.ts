import mongoose, { Schema } from 'mongoose';
import { INotification } from '../interfaces';

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as any,
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      type: Schema.Types.ObjectId,
    } as any,
    entityType: {
      type: String,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
