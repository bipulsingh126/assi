import { config } from 'dotenv';
import path from 'path';

// Load env vars
config();

export const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-panel';
export const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const port = process.env.PORT || 5001;

export default { mongoURI, jwtSecret, port }; 