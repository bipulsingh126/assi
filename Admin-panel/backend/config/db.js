import { connect } from 'mongoose';
import { mongoURI } from './config.js';

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB with URI:', mongoURI);

        const conn = await connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB; 