# Admin Panel Project

A full-stack admin panel application with React frontend and Node.js backend.

## Project Structure

- `/src` - React frontend
- `/backend` - Node.js Express backend

## Frontend

The frontend is built with:
- React 19
- Material UI 7
- React Router 7
- Tailwind CSS 4

### Running the Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Backend

The backend is built with:
- Node.js
- Express
- MongoDB
- JWT Authentication

### Running the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Setup

Create a `.env` file in the backend directory with:

```
MONGODB_URI=mongodb://localhost:27017/admin-panel
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Features

- User authentication (login/register)
- Dashboard with statistics
- Product management (CRUD)
- Responsive design
- JWT authentication
- Protected routes

## API Endpoints

See the [backend README](./backend/README.md) for detailed API documentation.
