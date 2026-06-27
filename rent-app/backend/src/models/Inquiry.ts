import mongoose, { Schema } from 'mongoose';
import { IInquiry } from '../interfaces';

const inquirySchema = new Schema<IInquiry>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    } as any,
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as any,
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'read', 'replied'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

inquirySchema.index({ propertyId: 1 });
inquirySchema.index({ tenantId: 1 });
inquirySchema.index({ status: 1 });

export default mongoose.model<IInquiry>('Inquiry', inquirySchema);
