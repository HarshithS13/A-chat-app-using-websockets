import mongoose from 'mongoose';

// User Interface
export interface IUser {
  userId: string;
  username: string;
  socketId: string;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema = new mongoose.Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    socketId: {
      type: String,
      required: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create indexes for better query performance
userSchema.index({ socketId: 1 });

// Static methods
userSchema.statics.findByUserId = function(userId: string) {
  return this.findOne({ userId });
};

userSchema.statics.findBySocketId = function(socketId: string) {
  return this.findOne({ socketId });
};

// Create and export the model
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel; 