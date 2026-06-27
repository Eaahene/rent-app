# RentApp - Complete Project Guide

A full-stack rental marketplace connecting tenants directly with landlords in Ghana. No agents, less stress, more choices.

---

## Tech Stack

### Frontend (`rent-app/frontend/`)
| Tech | Version | What it does |
|---|---|---|
| Next.js | 14.0.3 | React framework, App Router, file-based routing |
| React | 18.2.0 | UI library |
| TypeScript | 5.3.2 | Type safety across the codebase |
| Tailwind CSS | 3.3.6 | Utility-first styling |
| shadcn/ui | Radix primitives | Pre-built UI components (Button, Card, Table, Dialog, etc.) |
| TanStack React Query | 5.8.4 | Server state management, caching, refetching |
| Zustand | 5.0.14 | Client state (auth user, UI toggles) |
| Axios | 1.6.2 | HTTP client with interceptors for token refresh |
| React Hook Form + Zod | 7.48 / 3.22 | Form handling + validation |
| Lucide React | 0.294 | Icon library |
| next-themes | 0.2.1 | Dark/light mode toggle |
| Recharts | 2.10.3 | Charts for admin analytics dashboard |
| react-hot-toast | 2.4.1 | Toast notifications |
| date-fns | 2.30 | Date formatting (timeAgo, formatDate) |

### Backend (`rent-app/backend/`)
| Tech | Version | What it does |
|---|---|---|
| Express.js | 4.18.2 | Web framework, routing, middleware |
| TypeScript | 5.3.2 | Type safety |
| MongoDB + Mongoose | 7.6.3 | Database + ODM (object-document mapper) |
| bcryptjs | 2.4.3 | Password hashing (12 rounds) |
| jsonwebtoken | 9.0.2 | JWT access + refresh tokens |
| Cloudinary | 1.41.0 | Image upload, storage, transformation |
| multer + multer-storage-cloudinary | 1.4.5 | File upload middleware (streams to Cloudinary) |
| Nodemailer | 6.9.7 | Sending verification + reset password emails |
| Zod | 3.22.4 | Request body/query/params validation |
| cookie-parser | 1.4.6 | Parsing refresh token cookies |
| cors | 2.8.5 | Cross-origin requests (Vercel frontend <-> Render backend) |
| sharp | 0.33.0 | Image processing |

### Deployment
| Platform | What it hosts |
|---|---|
| Vercel | Frontend (Next.js) |
| Render | Backend (Express API) |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image storage |

---

## Project Structure

```
rent-app/
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router (pages & routes)
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API service layer (Axios calls)
│   │   ├── store/               # Zustand state stores
│   │   ├── types/               # TypeScript type definitions
│   │   └── lib/                 # Utility functions
│   ├── public/                  # Static assets
│   ├── next.config.js           # Next.js config (image domains, API proxy)
│   ├── tailwind.config.ts       # Tailwind CSS config
│   ├── tsconfig.json            # TypeScript config
│   └── vercel.json              # Vercel deployment config
│
├── backend/                     # Express.js backend
│   ├── src/
│   │   ├── config/              # Database & Cloudinary setup
│   │   ├── controllers/         # Route handlers (business logic)
│   │   ├── interfaces/          # TypeScript interfaces & enums
│   │   ├── middleware/           # Auth, validation, error handling
│   │   ├── models/              # Mongoose schemas (database models)
│   │   ├── routes/              # Express route definitions
│   │   ├── seeds/               # Database seed data
│   │   ├── utils/               # Helpers (tokens, emails, responses)
│   │   └── validators/          # Zod validation schemas
│   ├── .env                     # Environment variables (gitignored)
│   ├── tsconfig.json            # TypeScript config
│   └── package.json             # Dependencies
│
└── PROJECT_GUIDE.md              # This file
```

---

## How the App Works

### Authentication Flow
1. User registers/logs in -> backend validates credentials -> generates JWT access token (15min) + refresh token (7 days)
2. Access token returned in response body AND set as a cookie
3. Refresh token set as httpOnly cookie (not readable by JS)
4. Frontend stores access token in memory + reads from cookie on page refresh
5. On every API request, Axios interceptor attaches `Authorization: Bearer <token>` header
6. If token expires (401), interceptor silently calls `/api/auth/refresh` using the cookie
7. New access token issued, original request retried
8. If refresh fails -> user redirected to login

### Role-Based Access
Three roles: **Tenant**, **Landlord**, **Admin**

Each dashboard layout has an auth guard that checks the user's role. If wrong role or not authenticated, redirect to `/login`.

| Role | Can do |
|---|---|
| Tenant | Search properties, save favorites, send inquiries, manage profile |
| Landlord | Create/edit/delete properties, respond to inquiries, view stats |
| Admin | Approve/reject properties, manage users, verify landlords, site settings |

### Image Upload Flow
1. Frontend sends files to `/api/upload/images` as multipart/form-data
2. Multer middleware catches files, streams to Cloudinary
3. Cloudinary stores image, returns URL + publicId
4. Frontend saves url+publicId in property images array
5. Images served directly from Cloudinary CDN

### Property Approval Flow
1. Landlord creates property -> `isApproved: false` (pending)
2. Admin sees pending properties in `/admin/dashboard/properties`
3. Admin clicks property to review full details (images, description, amenities, landlord info)
4. Admin approves or rejects
5. Only approved properties appear in public search

---

## Frontend File Guide

### `src/app/` - Pages & Routes

```
app/
├── layout.tsx              # Root layout - wraps everything with Navbar + Footer
├── providers.tsx           # Client component - QueryProvider + ThemeProvider + Toaster
├── globals.css             # Tailwind imports + shadcn/ui CSS variables (light/dark themes)
├── not-found.tsx           # Custom 404 page
│
├── (auth)/                 # Auth pages (no Navbar)
│   ├── layout.tsx          # Passthrough layout
│   ├── login/page.tsx      # /login - LoginForm component
│   ├── register/page.tsx   # /register - RegisterForm, accepts ?role=landlord
│   ├── forgot-password/    # /forgot-password - sends reset email
│   ├── reset-password/     # /reset-password - via token in URL
│   └── verify-email/       # /verify-email - via token in URL
│
├── (public)/               # Public pages (with Navbar + Footer)
│   ├── page.tsx            # / - Homepage: hero, featured properties, how-it-works, recent listings
│   ├── loading.tsx         # Homepage skeleton
│   ├── about/page.tsx      # /about - Mission/vision fetched from SiteSettings API
│   ├── properties/
│   │   ├── page.tsx        # /properties - Search with filters (region, type, price, bedrooms)
│   │   ├── loading.tsx     # Properties skeleton
│   │   └── [id]/
│   │       ├── page.tsx    # /properties/:id - Full detail: gallery, description, map, inquiry form
│   │       └── loading.tsx # Detail skeleton
│
├── tenant/                 # Tenant dashboard
│   ├── layout.tsx          # Auth guard (TENANT role) + Sidebar + MobileSidebar
│   └── dashboard/
│       ├── page.tsx        # /tenant/dashboard - Stats, recent inquiries, favorites
│       ├── loading.tsx
│       ├── favorites/      # /tenant/dashboard/favorites - Saved properties grid
│       ├── inquiries/      # /tenant/dashboard/inquiries - Sent inquiries with status
│       └── profile/        # /tenant/dashboard/profile - Edit profile, change password
│
├── landlord/               # Landlord dashboard
│   ├── layout.tsx          # Auth guard (LANDLORD/ADMIN role) + Sidebar
│   └── dashboard/
│       ├── page.tsx        # /landlord/dashboard - Stats, recent inquiries, properties
│       ├── loading.tsx
│       ├── properties/
│       │   ├── page.tsx    # /landlord/dashboard/properties - My listings table
│       │   ├── new/        # /landlord/dashboard/properties/new - Create form
│       │   └── [id]/edit/  # /landlord/dashboard/properties/:id/edit - Edit form
│       ├── inquiries/      # /landlord/dashboard/inquiries - Received inquiries
│       └── profile/        # /landlord/dashboard/profile
│
└── admin/                  # Admin dashboard
    ├── layout.tsx          # Auth guard (ADMIN role) + Sidebar
    └── dashboard/
        ├── page.tsx        # /admin/dashboard - Stats cards, analytics charts, recent data
        ├── loading.tsx
        ├── users/          # /admin/dashboard/users - User table, verify/suspend, role filter
        ├── properties/
        │   ├── page.tsx    # /admin/dashboard/properties - All properties, approve/reject
        │   └── [id]/
        │       ├── page.tsx    # /admin/dashboard/properties/:id - Full review before approve
        │       └── loading.tsx
        └── settings/       # /admin/dashboard/settings - Edit site settings (about, contact)
```

### `src/components/` - Component Guide

#### `components/ui/` - shadcn/ui Base Components
These are reusable primitives. Don't modify unless you know what you're doing.

| Component | Used for |
|---|---|
| `button.tsx` | All buttons (default, destructive, outline, ghost variants) |
| `card.tsx` | Card containers (Card, CardHeader, CardContent, CardTitle) |
| `table.tsx` | Data tables (property lists, user lists, inquiry lists) |
| `dialog.tsx` | Modal dialogs (image lightbox, edit forms) |
| `dropdown-menu.tsx` | Action menus (3-dot menus on tables) |
| `select.tsx` | Dropdown selects (region, property type, filters) |
| `form.tsx` | React Hook Form integration wrapper |
| `input.tsx` | Text inputs |
| `textarea.tsx` | Multi-line text (inquiry messages, descriptions) |
| `badge.tsx` | Status badges (Available, Pending, Active, Suspended) |
| `sheet.tsx` | Slide-out panels (mobile sidebar, mobile filters) |
| `skeleton.tsx` | Loading placeholder shapes |
| `alert-dialog.tsx` | Confirmation popups (delete confirmations) |
| `avatar.tsx` | User avatars with fallback initials |
| `tabs.tsx` | Tab navigation |
| `separator.tsx` | Visual dividers |

#### `components/layout/` - Layout Components

| Component | File | What it does |
|---|---|---|
| **Navbar** | `Navbar.tsx` | Top navigation bar. Shows logo, nav links (Home, Properties, About), theme toggle, auth dropdown (avatar + role-specific links). Mobile: hamburger menu via Sheet. |
| **Footer** | `Footer.tsx` | Bottom footer. 4-column grid: logo, quick links, property types, contact info. |
| **Sidebar** | `Sidebar.tsx` | Dashboard sidebar. Two exports: `Sidebar` (desktop, `hidden lg:block`) and `MobileSidebar` (floating hamburger button + slide-out overlay). Role-specific links passed as prop. |

#### `components/property/` - Property Components

| Component | What it does |
|---|---|
| **PropertyCard** | Card shown in property grids. Image with badges (status, featured), favorite heart button, price (GH₵), title, location, bedrooms/bathrooms, time ago, verified landlord badge. |
| **PropertyFilters** | Filter sidebar. Region select, city input, property type, price range, bedrooms, sort, amenity toggles. Desktop: fixed sidebar. Mobile: Sheet slide-out. |
| **PropertyGallery** | Image grid on property detail. First image larger, rest in grid. Click opens lightbox dialog. |
| **PropertyCarousel** | Image carousel with prev/next buttons and dot indicators. |
| **PropertyAmenities** | Grid display of amenity badges with checkmarks. |
| **PropertyMap** | Placeholder showing address with Google Maps link (no Leaflet yet). |
| **PropertySkeleton** | Loading skeleton for single card and grid of 6 cards. |
| **SimilarProperties** | Grid of PropertyCard components for similar listings. |

#### `components/admin/` - Admin Components

| Component | What it does |
|---|---|
| **PropertyTable** | Table of all properties. Columns: image+title (links to review page), landlord, price, status, approved (check/x), featured (star). Dropdown: view details, approve/reject, feature/unfeature, delete. |
| **UserTable** | Table of all users. Columns: name, email, role badge, verified (check), active/suspended badge, joined date. Dropdown: verify/unverify landlord, suspend/activate. |
| **AnalyticsCharts** | Two Recharts charts: PieChart (approved vs pending properties), BarChart (users by role). |

#### `components/landlord/` - Landlord Components

| Component | What it does |
|---|---|
| **StatsCards** | 4 stat cards: total properties, total views, inquiries, available count. |
| **PropertyTable** | Landlord's properties table. Columns: property, location, price, status, views, posted. Actions: edit, delete. |
| **InquiryTable** | Received inquiries table. Columns: tenant, property, message, status, date. Actions: mark read, mark replied. |

#### `components/forms/` - Form Components

| Component | What it does |
|---|---|
| **LoginForm** | Email + password with show/hide toggle, forgot password link, Zod validation. |
| **RegisterForm** | Name, email, phone, role (find/list property), password + confirm. Accepts `?role=landlord` from URL. |
| **PropertyForm** | Full property create/edit form. 4 sections: Basic Info (title, description, price, phone), Location (region, city, area, address), Details (type, status, bedrooms, bathrooms, max tenants), Amenities (toggle chips), Images (Cloudinary upload, max 10, cover label). |
| **ProfileForm** | Two dialogs: Edit Profile (name, phone) and Change Password (current, new, confirm). |

#### `components/feedback/` - Feedback Components

| Component | What it does |
|---|---|
| **EmptyState** | Shown when no data. Icon, title, description, optional action button. |
| **ErrorBoundary** | React error boundary with retry button. |

### `src/hooks/` - Custom Hooks

| Hook | File | What it does |
|---|---|---|
| `useAuth` | `useAuth.ts` | Returns: user, isLoading, isAuthenticated, login(), register(), logout(), hasRole(). Fetches `/auth/me` on mount. Login stores token + redirects by role. |
| `useProperties` | `useProperties.ts` | `useProperties(filters)` - paginated filtered list. `useProperty(id)` - single. `useFeaturedProperties()` - homepage featured. `useRecentProperties()` - homepage recent. `useMyProperties()` - landlord's. `useCreateProperty/update/delete` - mutations. `useFavorite/toggle` - favorites. |
| `useInquiries` | `useInquiries.ts` | `useMyInquiries()` - tenant's sent. `useLandlordInquiries()` - landlord's received. `useCreateInquiry()` - send new. `useUpdateInquiryStatus()` - mark read/replied. |
| `useAdmin` | `useAdmin.ts` | `useDashboardStats()` - admin overview. `useAllUsers(params)` - paginated users. `useAllProperties(params)` - paginated properties. `useVerifyLandlord()` - verify/unverify. `useApproveProperty()` - approve/reject. `useToggleFeatured()`. `useAdminProperty(id)` - single for review. |

### `src/services/` - API Service Layer

Each file wraps Axios calls to a specific backend endpoint group.

| Service | File | Endpoints called |
|---|---|---|
| **api.ts** | `api.ts` | Axios instance with interceptors. Request: adds Bearer token (from memory or cookie). Response: auto-refresh on 401, redirect on failure. |
| **auth** | `auth.ts` | POST register/login/logout/forgot-password/reset-password, GET /me, PATCH /me, PATCH /me/password, GET verify-email |
| **properties** | `properties.ts` | GET properties (with query string builder), GET/POST/PATCH/DELETE /:id, GET featured/recent/similar, POST favorite, GET favorites/check-favorite |
| **inquiries** | `inquiries.ts` | POST /, GET /me, GET /landlord, GET /property/:id, PATCH /:id/status |
| **admin** | `admin.ts` | GET /stats, GET/PATCH /users, PATCH /landlords/:id/verify, GET/PATCH/DELETE /properties, GET /properties/:id |
| **upload** | `upload.ts` | POST /images (FormData multipart), DELETE /images/:publicId, POST /avatar |
| **settings** | `settings.ts` | GET /, PUT / |

### `src/store/` - Zustand Stores

| Store | File | State |
|---|---|---|
| **auth** | `auth.ts` | `user`, `isLoading`, `isAuthenticated`. Actions: `setUser`, `setLoading`, `logout`. |
| **ui** | `ui.ts` | `isMobileMenuOpen`, `isSidebarOpen`, `isFilterOpen`. Actions: toggles for each. |

### `src/types/` - TypeScript Types

All types in `types/index.ts`:
- **UserRole**: enum (TENANT, LANDLORD, ADMIN)
- **User**: full user object with all fields
- **PropertyType**: enum (apartment, studio, house, penthouse, room, duplex, townhouse, commercial)
- **PropertyStatus**: enum (available, rented, maintenance)
- **Property**: full property object with populated landlordId
- **Inquiry**: propertyId, tenantId, message, status
- **SearchParams**: all filter params for property search
- **ApiResponse / PaginatedResponse**: API response wrappers

### `src/lib/` - Utilities

| Function | What it does |
|---|---|
| `cn()` | Combines clsx + tailwind-merge for conditional classnames |
| `formatPrice(num)` | Formats number as GH₵ currency (e.g., GH₵ 2,500) |
| `formatDate(date)` | Formats date as readable string |
| `timeAgo(date)` | Relative time (e.g., "3 hours ago") |
| `PROPERTY_TYPE_LABELS` | Maps enum values to display labels |
| `AMENITY_LABELS` | Maps amenity keys to display labels |
| `REGIONS` | Array of 16 Ghana regions |

---

## Backend File Guide

### `src/server.ts` - Entry Point
Creates Express app, configures CORS (allows localhost + .vercel.app), mounts all routes under `/api`, connects to MongoDB, starts server on PORT (default 5000).

### `src/config/` - Configuration

| File | What it does |
|---|---|
| `db.ts` | Connects to MongoDB Atlas using MONGODB_URI env var |
| `cloudinary.ts` | Configures Cloudinary v2 + multer storage (rent-app/properties folder, webp format, 1200px max width, 5MB limit) |

### `src/interfaces/` - TypeScript Interfaces

All in `interfaces/index.ts`:
- **IUser**: name, email, password, phone, role, avatar, isVerified, isActive, refreshToken, passwordResetToken, emailVerificationToken, comparePassword()
- **IProperty**: title, description, price, region, city, area, address, propertyType, bedrooms, bathrooms, maxTenants, amenities[], images[{url, publicId}], status, location (GeoJSON), contactPhone, landlordId, isApproved, isFeatured, views
- **IInquiry**: propertyId, tenantId, message, status (pending/read/replied)
- **IFavorite**: userId, propertyId
- **INotification**: userId, title, message, type, read, relatedEntity, entityType
- Enums: UserRole, PropertyType, PropertyStatus

### `src/models/` - Database Models

| Model | Collection | Key fields | Notes |
|---|---|---|---|
| **User** | users | email (unique, indexed), password (hashed, select:false), role, isVerified, isActive, refreshToken (select:false) | Pre-save hook hashes password. Methods: comparePassword(), toJSON() strips sensitive fields. |
| **Property** | properties | title, price, region, city, propertyType, bedrooms, amenities[], images[{url, publicId}], landlordId (ref User), isApproved, isFeatured, views | Indexes on: landlordId, status, region+city, propertyType, price, location (2dsphere), isApproved+isFeatured+createdAt |
| **Inquiry** | inquiries | propertyId (ref Property), tenantId (ref User), message, status | Indexes on propertyId, tenantId, status |
| **Favorite** | favorites | userId (ref User), propertyId (ref Property) | Unique compound index on userId+propertyId |
| **Notification** | notifications | userId, title, message, type, read, relatedEntity | Index on userId+read |
| **SiteSettings** | sitesettings | aboutTitle, aboutContent, aboutMission, aboutVision, contactPhone, contactEmail | Singleton pattern (one document) |

### `src/middleware/` - Middleware

| Middleware | What it does |
|---|---|
| `authenticate` | Extracts token from `Authorization: Bearer` header OR `accessToken` cookie. Verifies JWT. Attaches user to `req.user`. Checks `isActive`. |
| `authorize(...roles)` | Checks `req.user.role` against allowed roles. Returns 403 if not authorized. |
| `validate(schema)` | Validates `req.body`, `req.query`, or `req.params` against a Zod schema. Returns formatted errors. |
| `errorHandler` | Catches ApiError instances, returns proper status code + JSON error response. |
| `notFound` | 404 handler for unmatched routes. |

### `src/controllers/` - Route Handlers

#### Auth Controller (`authController.ts`)
| Handler | What it does |
|---|---|
| `register` | Creates user, generates tokens, sends verification email |
| `login` | Validates credentials, generates tokens, sets cookies |
| `logout` | Clears refresh token from DB + cookies |
| `refreshToken` | Verifies refresh token cookie, issues new token pair |
| `getMe` | Returns current user from `req.user` |
| `forgotPassword` | Generates reset token, sends email with link |
| `resetPassword` | Verifies reset token, updates password |
| `verifyEmail` | Verifies email token, sets `isVerified: true` |
| `updateProfile` | Updates name, phone, avatar |
| `changePassword` | Verifies current password, updates to new |

#### Property Controller (`propertyController.ts`)
| Handler | What it does |
|---|---|
| `getProperties` | Filtered search (region, city, type, price, bedrooms, amenities, geo). Sorting, pagination. Populates landlord. |
| `getPropertyById` | Single property, increments views, populates landlord |
| `getSimilarProperties` | Finds by same city+type or same type+price range |
| `createProperty` | Creates new listing (auto-approved if admin) |
| `updateProperty` | Updates listing (owner or admin only) |
| `deleteProperty` | Deletes listing + cascading favorites (owner or admin) |
| `getMyProperties` | Landlord's properties with pagination |
| `toggleFavorite` | Add/remove from favorites |
| `getMyFavorites` | Tenant's saved properties |
| `checkFavorite` | Check if property is favorited |
| `getFeaturedProperties` | Limit 8 featured |
| `getRecentProperties` | Limit 8 most recent |

#### Inquiry Controller (`inquiryController.ts`)
| Handler | What it does |
|---|---|
| `createInquiry` | Sends inquiry (prevents self-inquiry), creates notification for landlord |
| `getPropertyInquiries` | All inquiries for a property (owner or admin) |
| `getMyInquiries` | Tenant's sent inquiries |
| `getLandlordInquiries` | All inquiries for landlord's properties |
| `updateInquiryStatus` | Mark as read/replied |

#### Admin Controller (`adminController.ts`)
| Handler | What it does |
|---|---|
| `getDashboardStats` | Counts: users, landlords, tenants, properties, approved, pending, inquiries + recent data |
| `getAllUsers` | Paginated users with role/search filter |
| `updateUserStatus` | Activate/suspend user |
| `verifyLandlord` | Verify/unverify landlord |
| `getAllProperties` | Paginated properties with status/search/approval filter |
| `getPropertyById` | Single property for admin review |
| `approveProperty` | Approve or reject listing |
| `deleteProperty` | Delete any property |
| `toggleFeatured` | Feature/unfeature property |

#### Upload Controller (`uploadController.ts`)
| Handler | What it does |
|---|---|
| `uploadImages` | Upload up to 10 files to Cloudinary, returns url+publicId |
| `deleteImage` | Delete image from Cloudinary by publicId |
| `uploadAvatar` | Single file upload for user avatar |

#### Settings Controller (`settingsController.ts`)
| Handler | What it does |
|---|---|
| `getSettings` | Returns site settings (creates defaults if none exist) |
| `updateSettings` | Updates site settings (admin only) |

### `src/routes/` - Route Definitions

| Route file | Mount point | Endpoints |
|---|---|---|
| `authRoutes.ts` | `/api/auth` | POST register, POST login, POST logout, POST refresh, GET /me, PATCH /me, PATCH /me/password, POST forgot-password, POST reset-password, GET verify-email |
| `propertyRoutes.ts` | `/api/properties` | GET / (search), GET featured, GET recent, GET /:id, GET /:id/similar, POST /, PATCH /:id, DELETE /:id, GET landlord/me, POST /:propertyId/favorite, GET user/favorites, GET /:propertyId/check-favorite |
| `inquiryRoutes.ts` | `/api/inquiries` | POST /, GET /me, GET /landlord, GET /property/:propertyId, PATCH /:id/status |
| `adminRoutes.ts` | `/api/admin` | GET /stats, GET /users, PATCH /users/:id/status, PATCH /landlords/:id/verify, GET /properties, GET /properties/:id, PATCH /properties/:id/approve, DELETE /properties/:id, PATCH /properties/:id/featured |
| `uploadRoutes.ts` | `/api/upload` | POST /images, DELETE /images/:publicId, POST /avatar |
| `settingsRoutes.ts` | `/api/settings` | GET /, PUT / |
| `index.ts` | `/api` | Aggregates all route modules |

### `src/validators/` - Zod Schemas

10 schemas in `validators/index.ts`:
- `registerSchema` - name, email, password, phone, role
- `loginSchema` - email, password
- `forgotPasswordSchema` - email
- `resetPasswordSchema` - token, password
- `updateProfileSchema` - name?, phone?, avatar?
- `changePasswordSchema` - currentPassword, newPassword, confirmPassword
- `createPropertySchema` - all required property fields
- `updatePropertySchema` - all optional property fields
- `createInquirySchema` - propertyId (ObjectId regex), message
- `propertySearchSchema` - query params with coercion, defaults

### `src/utils/` - Utilities

| File | What it does |
|---|---|
| `apiResponse.ts` | `ApiError` class with factory methods (badRequest/400, unauthorized/401, forbidden/403, notFound/404, conflict/409, internal/500). `ApiResponse` class (success, created/201, paginated). |
| `catchAsync.ts` | Wraps async handlers to catch errors and pass to Express error handler |
| `email.ts` | Nodemailer transporter, `sendEmail()`, HTML templates for verification + reset password emails |
| `tokens.ts` | `generateTokens()` (access 15min + refresh 7days). `setTokenCookies()` (accessToken readable + refreshToken httpOnly). `clearTokenCookies()`. |

### `src/seeds/` - Seed Data

| File | What it does |
|---|---|
| `index.ts` | Clears DB, creates 1 admin + 3 landlords (2 verified) + 2 tenants. Creates 8 properties across Ghana (Accra, Kumasi, Takoradi, Cape Coast, Tema) with varied types and Unsplash images. |
| `updateAdmin.ts` | Resets admin password to "Admin@12345" |

---

## Environment Variables

### Backend (`.env` or Render env vars)
| Variable | Example | Purpose |
|---|---|---|
| `PORT` | 5000 | Server port |
| `MONGODB_URI` | mongodb+srv://... | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | rent_app_dev_access_secret | Access token signing key |
| `JWT_REFRESH_SECRET` | rent_app_dev_refresh_secret | Refresh token signing key |
| `JWT_ACCESS_EXPIRY` | 900 | Access token expiry (seconds or "15m") |
| `JWT_REFRESH_EXPIRY` | 604800 | Refresh token expiry (seconds or "7d") |
| `CLOUDINARY_CLOUD_NAME` | your_cloud_name | Cloudinary account |
| `CLOUDINARY_API_KEY` | your_api_key | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your_api_secret | Cloudinary API secret |
| `SMTP_HOST` | smtp.gmail.com | Email server |
| `SMTP_PORT` | 587 | Email port |
| `SMTP_USER` | your@gmail.com | Email address |
| `SMTP_PASS` | your_app_password | Email password |
| `CLIENT_URL` | https://your-app.vercel.app | Frontend URL for CORS + email links |

### Frontend (`.env.local` or Vercel env vars)
| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | https://your-api.onrender.com/api | Backend API URL |

---

## Common Tasks - Where to Make Changes

### "I want to change the homepage"
Edit `frontend/src/app/(public)/page.tsx`

### "I want to add a new property type"
1. Add to `PropertyType` enum in `backend/src/interfaces/index.ts`
2. Add to `PropertyType` enum in `frontend/src/types/index.ts`
3. Add label to `PROPERTY_TYPE_LABELS` in `frontend/src/lib/utils.ts`

### "I want to change the color scheme"
Edit CSS variables in `frontend/src/app/globals.css` (look for `:root` and `.dark` blocks)

### "I want to add a new dashboard page for landlords"
1. Create `frontend/src/app/landlord/dashboard/yourpage/page.tsx`
2. Add nav link in `frontend/src/components/layout/Sidebar.tsx` (landlordLinks array)

### "I want to add a new field to properties"
1. Add field to `IProperty` interface in `backend/src/interfaces/index.ts`
2. Add field to Mongoose schema in `backend/src/models/Property.ts`
3. Add field to Zod validators in `backend/src/validators/index.ts`
4. Add field to `PropertyForm` in `frontend/src/components/forms/PropertyForm.tsx`
5. Update `Property` type in `frontend/src/types/index.ts`

### "I want to change the API endpoints"
Edit route definitions in `backend/src/routes/` and corresponding controller in `backend/src/controllers/`

### "I want to change the admin analytics"
Edit `frontend/src/components/admin/AnalyticsCharts.tsx` (uses Recharts)

### "I want to add a new email template"
1. Create HTML template function in `backend/src/utils/email.ts`
2. Call it from the relevant controller

### "I want to add Leaflet maps"
The `PropertyMap` component at `frontend/src/components/property/PropertyMap.tsx` is currently a placeholder with a Google Maps link. Replace it with a Leaflet + OpenStreetMap component.

### "I want to add notifications UI"
Backend model exists at `backend/src/models/Notification.ts`. Backend creates notifications on inquiry. Frontend has no notification UI yet - create it in `frontend/src/components/`.

---

## Deployment Checklist

1. **MongoDB Atlas**: Create cluster, whitelist IPs (0.0.0.0/0 for Render), create database user
2. **Cloudinary**: Create account, get cloud name + API key + secret
3. **Backend (Render)**: Set env vars, build command: `npm install --include=dev && npm run build`, start: `npm start`
4. **Frontend (Vercel)**: Set `NEXT_PUBLIC_API_URL`, root directory: `rent-app/frontend`
5. **Seed database**: Run `npm run seed` locally (connects to same MongoDB Atlas)

---

## Database Seed Data

When you run `npm run seed`, it creates:

| User | Email | Password | Role |
|---|---|---|---|
| Admin User | admin@rentapp.com | Admin@12345 | admin |
| Sarah Johnson | sarah@landlord.com | landlord123 | landlord (verified) |
| Michael Owusu | michael@landlord.com | landlord123 | landlord (verified) |
| Grace Mensah | grace@landlord.com | landlord123 | landlord (NOT verified) |
| John Doe | john@tenant.com | tenant123 | tenant |
| Jane Smith | jane@tenant.com | tenant123 | tenant |

8 properties seeded across Ghana with realistic data (Accra, Kumasi, Takoradi, Cape Coast, Tema).
