# RentApp - Rental Marketplace Platform

A full-stack rental marketplace web application that connects tenants directly with landlords, eliminating the need for agents and reducing the stress of physically searching for rental properties.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Zod
- **Icons:** Lucide React
- **Dark Mode:** next-themes

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (Access + Refresh tokens)
- **Image Upload:** Cloudinary
- **Email:** Nodemailer

## Project Structure

```
rent-app/
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   ├── store/               # Zustand stores
│   │   ├── lib/                 # Utilities
│   │   ├── types/               # TypeScript types
│   │   └── schemas/             # Zod schemas
│   └── public/                  # Static assets
│
├── backend/                     # Express.js backend
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route handlers
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # Express routes
│   │   ├── middleware/          # Custom middleware
│   │   ├── services/            # Business logic
│   │   ├── validators/          # Zod schemas
│   │   ├── utils/               # Utility functions
│   │   ├── interfaces/          # TypeScript interfaces
│   │   ├── seeds/               # Seed data
│   │   └── server.ts            # Entry point
│   └── uploads/                 # Temp uploads
│
└── README.md
```

## Features

### Authentication
- User registration (Tenant/Landlord)
- Login/Logout
- JWT authentication with refresh tokens
- Email verification
- Forgot/Reset password
- Role-based access control

### Tenant Features
- Browse and search properties
- Filter by region, city, property type, price, bedrooms
- View property details with image gallery
- Save favorites
- Send inquiries to landlords
- Dashboard with favorites and inquiries

### Landlord Features
- Register as landlord
- Add/Edit/Delete properties
- Upload multiple images
- View inquiries
- Dashboard with statistics

### Admin Features
- Manage users
- Verify landlords
- Approve/Reject properties
- Feature properties
- View analytics

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd rent-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# - MongoDB URI
# - JWT secrets
# - Cloudinary credentials
# - Email credentials

# Seed the database
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Update .env.local with your configuration

# Start development server
npm run dev
```

### 4. Access the application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

## Test Accounts

After running the seed command:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rentapp.com | admin123 |
| Landlord | sarah@landlord.com | landlord123 |
| Landlord | michael@landlord.com | landlord123 |
| Tenant | john@tenant.com | tenant123 |
| Tenant | jane@tenant.com | tenant123 |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email` - Verify email

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property by ID
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/recent` - Get recent properties
- `POST /api/properties` - Create property (Landlord)
- `PATCH /api/properties/:id` - Update property (Landlord)
- `DELETE /api/properties/:id` - Delete property (Landlord)
- `GET /api/properties/landlord/me` - Get my properties
- `POST /api/properties/:propertyId/favorite` - Toggle favorite
- `GET /api/properties/user/favorites` - Get favorites
- `GET /api/properties/:id/similar` - Get similar properties

### Inquiries
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries/me` - Get my inquiries
- `GET /api/inquiries/landlord` - Get landlord inquiries
- `PATCH /api/inquiries/:id/status` - Update status

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/status` - Update user status
- `PATCH /api/admin/landlords/:id/verify` - Verify landlord
- `GET /api/admin/properties` - Get all properties
- `PATCH /api/admin/properties/:id/approve` - Approve property
- `DELETE /api/admin/properties/:id` - Delete property
- `PATCH /api/admin/properties/:id/featured` - Toggle featured

### Upload
- `POST /api/upload/images` - Upload images
- `DELETE /api/upload/images/:publicId` - Delete image
- `POST /api/upload/avatar` - Upload avatar

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rent-app
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## License

MIT
