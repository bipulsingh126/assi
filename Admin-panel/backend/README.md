# Admin Panel Backend

This is the backend API for the Admin Panel application, built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/admin-panel
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. For production:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (Protected)
- `GET /api/products/:id` - Get single product (Protected)
- `POST /api/products` - Create new product (Protected)
- `PUT /api/products/:id` - Update product (Protected)
- `DELETE /api/products/:id` - Delete product (Protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (Protected)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
``` 