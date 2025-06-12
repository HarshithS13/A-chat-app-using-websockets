import mongoose from 'mongoose';

// Message Interface
export interface IMessage {
  messageId: string;
  text: string;
  sender: string;
  timestamp: Date;
  isSystemMessage: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Message Schema
const messageSchema = new mongoose.Schema<IMessage>(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isSystemMessage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create indexes for better query performance
messageSchema.index({ timestamp: -1 }); // Descending index for latest messages
messageSchema.index({ sender: 1 });

// Static methods
messageSchema.statics.findLatestMessages = function(limit = 100) {
  return this.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .exec();
};

// Create and export the model
export const MessageModel = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default MessageModel; 