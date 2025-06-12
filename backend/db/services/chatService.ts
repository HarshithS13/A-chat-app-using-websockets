import UserModel from '../models/User';
import MessageModel from '../models/Message';
import type { IUser } from '../models/User';
import type { IMessage } from '../models/Message';

export interface User {
  userId: string;
  username: string;
  socketId: string;
  lastActive: number;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

export class ChatService {
  // User methods
  async addUser(user: User): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ userId: user.userId });
      
      if (existingUser) {
        // Update existing user
        existingUser.socketId = user.socketId;
        existingUser.lastActive = new Date(user.lastActive);
        return await existingUser.save();
      } else {
        // Create new user
        const newUser = new UserModel({
          userId: user.userId,
          username: user.username,
          socketId: user.socketId,
          lastActive: new Date(user.lastActive),
        });
        return await newUser.save();
      }
    } catch (error) {
      console.error('Error adding/updating user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find()
        .sort({ lastActive: -1 })
        .exec();
      
      // Convert to the format expected by the frontend
      return users.map((user) => ({
        userId: user.userId,
        username: user.username,
        socketId: user.socketId,
        lastActive: user.lastActive.getTime(),
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async updateUserSocketId(userId: string, socketId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ userId });
      if (user) {
        user.socketId = socketId;
        user.lastActive = new Date();
        return await user.save();
      }
      return null;
    } catch (error) {
      console.error('Error updating user socket ID:', error);
      return null;
    }
  }

  async updateUserActivity(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ userId });
      if (user) {
        user.lastActive = new Date();
        return await user.save();
      }
      return null;
    } catch (error) {
      console.error('Error updating user activity:', error);
      return null;
    }
  }

  async removeUser(socketId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ socketId });
      if (user) {
        await UserModel.deleteOne({ socketId });
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error removing user:', error);
      return null;
    }
  }

  async findUserBySocketId(socketId: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ socketId });
      if (user) {
        return {
          userId: user.userId,
          username: user.username,
          socketId: user.socketId,
          lastActive: user.lastActive.getTime(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error finding user by socket ID:', error);
      return null;
    }
  }

  // Message methods
  async addMessage(message: Message): Promise<IMessage> {
    try {
      const newMessage = new MessageModel({
        messageId: message.id,
        text: message.text,
        sender: message.sender,
        timestamp: new Date(message.timestamp),
        isSystemMessage: message.sender === 'system',
      });
      return await newMessage.save();
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getLatestMessages(limit = 100): Promise<Message[]> {
    try {
      const messages = await MessageModel.find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean()
        .exec();
      
      // Convert to the format expected by the frontend and reverse to chronological order
      return messages
        .map((message) => ({
          id: message.messageId,
          text: message.text,
          sender: message.sender,
          timestamp: message.timestamp.getTime(),
        }))
        .reverse();
    } catch (error) {
      console.error('Error getting latest messages:', error);
      return [];
    }
  }

  async clearInactiveUsers(timeThreshold: number): Promise<number> {
    try {
      const thresholdDate = new Date(Date.now() - timeThreshold);
      const result = await UserModel.deleteMany({
        lastActive: { $lt: thresholdDate },
      });
      return result.deletedCount || 0;
    } catch (error) {
      console.error('Error clearing inactive users:', error);
      return 0;
    }
  }
}

export default new ChatService(); 