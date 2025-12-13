import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    
    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options that are now defaults in Mongoose 6+
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    
    // In development, provide helpful error messages
    if (process.env.NODE_ENV === 'development') {
      console.log('');
      console.log('🔧 MongoDB Connection Help:');
      console.log('1. Make sure MongoDB is running locally:');
      console.log('   - Install MongoDB Community Server');
      console.log('   - Start with: mongod --dbpath /path/to/your/db');
      console.log('2. Or use MongoDB Atlas (cloud):');
      console.log('   - Set MONGODB_URI in your .env file');
      console.log('   - Format: mongodb+srv://username:password@cluster.mongodb.net/portfolio');
      console.log('3. Or use Docker:');
      console.log('   - docker run -d -p 27017:27017 --name mongodb mongo');
      console.log('');
    }
    
    process.exit(1);
  }
};

export default connectDB;
