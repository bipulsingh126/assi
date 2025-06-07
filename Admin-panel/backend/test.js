import { connect, connection } from 'mongoose';
import { config } from 'dotenv';

// Load env vars
config();

console.log('Environment variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

// Test MongoDB connection
async function testConnection() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-panel';
    console.log('Connecting to MongoDB with URI:', mongoURI);
    
    const conn = await connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Close the connection
    await connection.close();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    process.exit();
  }
}

testConnection(); 