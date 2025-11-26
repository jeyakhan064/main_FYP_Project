# Fashion Forge - Technical Documentation

## Project Overview

**Name:** Fashion Forge
**Type:** Web-based 3D Apparel Customization Platform
**Purpose:** Allow users to design custom clothing using 3D models and AI-generated graphics

---

## Technology Stack

### Frontend
- **React 18** - UI component library
- **Vite** - Build tool and development server
- **React Router v6** - Page navigation
- **Valtio** - State management
- **Tailwind CSS 3** - Styling framework
- **Framer Motion** - Animation library

### 3D Graphics
- **Three.js** - 3D rendering engine
- **@react-three/fiber** - React wrapper for Three.js
- **@react-three/drei** - Three.js helper utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4** - Web server framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 7** - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing

### External Services
- **OpenAI DALL-E API** - AI image generation
- **Cloudinary** - Image hosting

### Development Tools
- **Git** - Version control
- **npm/Yarn** - Package management
- **dotenv** - Environment variables

---

## System Architecture

```
Client (React)  →  HTTP Requests  →  Server (Express)  →  Database (MongoDB)
                ↓
         localStorage (Cart, Auth)
```

### Ports
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Database: MongoDB Atlas (cloud)

---

## Database Schema

### 1. Users Collection
```javascript
{
  name: String,
  email: String,           // Unique
  password: String,        // Hashed with bcrypt
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Products Collection
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,        // jacket, shirt, pants
  modelPath: String,       // Path to 3D model file
  image: String,           // Product thumbnail
  colors: [String],        // Available colors
  sizes: [String],         // Available sizes
  stock: Number,
  isCustomizable: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Orders Collection
```javascript
{
  user: ObjectId,          // Reference to User
  orderItems: [
    {
      product: ObjectId,   // Reference to Product (optional for custom)
      name: String,
      image: String,
      price: Number,
      quantity: Number,
      size: String,
      color: String,
      isCustomized: Boolean,
      customization: {
        color: String,
        selectedModel: String,
        decals: {
          logo: String,
          full: String,
          back: String,
          leftSleeve: String,
          rightSleeve: String,
          pocket: String,
          collar: String,
          hood: String,
          tag: String
        },
        canvasSnapshot: String  // Base64 image of 3D design
      }
    }
  ],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,   // Cash on Delivery, Credit Card, etc.
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  status: String,          // Pending, Processing, Shipped, Delivered, Cancelled
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Contacts Collection
```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  status: String,          // New, Read, Responded, Archived
  response: String,
  respondedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/signup` | Public | Create new user account |
| POST | `/login` | Public | Login and get JWT token |
| POST | `/forgot-password` | Public | Request password reset |
| GET | `/me` | Private | Get current user info |

### Product Routes (`/api/products`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all products |
| GET | `/:id` | Public | Get single product |
| POST | `/` | Admin | Create new product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Order Routes (`/api/orders`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Create new order |
| GET | `/myorders` | Private | Get user's orders |
| GET | `/:id` | Private | Get single order |
| PUT | `/:id/pay` | Private | Mark order as paid |
| PUT | `/:id/deliver` | Admin | Mark order as delivered |
| PUT | `/:id/status` | Admin | Update order status |
| GET | `/` | Admin | Get all orders |

### Contact Routes (`/api/contact`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Public | Submit contact form |
| GET | `/` | Admin | Get all messages |
| PUT | `/:id/status` | Admin | Update message status |
| PUT | `/:id/respond` | Admin | Add response |
| DELETE | `/:id` | Admin | Delete message |

### AI Routes (`/api/v1/dalle`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Public | Generate AI image from prompt |

---

## Application Features

### 1. User Features

#### Home Page
- Hero section with call-to-action
- Features overview
- Collection showcase
- Testimonials
- Contact form
- Footer with links

#### Product Browsing
- View 13 products (jackets, shirts, pants)
- Filter by category
- See product details (price, colors, sizes)
- Add to cart directly from catalog

#### 3D Customization
- Select base product
- Choose base color
- Upload custom logos/images
- Place decals on 9 different areas:
  - Logo (front center)
  - Full texture
  - Back
  - Left sleeve
  - Right sleeve
- Use AI to generate designs
- Rotate 3D model 360 degrees
- Download design as image
- Add to cart

#### Shopping Cart
- View cart items
- Update quantities
- Remove items
- See subtotal, shipping, tax
- Proceed to checkout

#### Checkout Process
1. Enter shipping address
2. Select payment method
3. Review order
4. Place order
5. View confirmation

#### Order Tracking
- View order history
- Check order status
- See order details

#### Contact
- Submit inquiries via form
- Get confirmation message

### 2. Admin Features

#### Dashboard
- View total orders
- View total revenue
- View product count
- See recent orders

#### Product Management
- View all products in table
- Add new products
- Edit existing products
- Delete products
- Manage stock levels

#### Order Management
- View all orders in table
- Filter by status (Pending, Processing, Shipped, Delivered, Cancelled)
- Update order status
- View order details
- Auto-mark as paid when delivered

---

## User Workflow

### Standard Purchase Flow
```
1. Home Page
2. Browse Products (Explore Page)
3. Click Product
4. Customize in 3D
5. Add to Cart
6. View Cart
7. Enter Shipping Info
8. Select Payment Method
9. Place Order
10. View Order Confirmation
```

### Direct Purchase Flow
```
1. Home Page
2. Browse Products
3. Add to Cart (without customization)
4. Checkout
5. Place Order
```

### Contact Flow
```
1. Home Page or Contact Page
2. Fill Contact Form
3. Submit
4. Receive Confirmation
```

---

## Authentication Flow

### Sign Up
```
1. User enters name, email, password
2. Backend hashes password with bcrypt
3. User saved to database
4. JWT token generated
5. Token sent to client
6. Token stored in localStorage
7. User redirected to home
```

### Sign In
```
1. User enters email, password
2. Backend finds user by email
3. Password compared with bcrypt
4. JWT token generated
5. Token sent to client
6. Token stored in localStorage
7. User redirected to home
```

### Protected Routes
```
1. User makes request
2. Frontend sends JWT in Authorization header
3. Backend verifies token
4. If valid, request proceeds
5. If invalid, 401 error returned
```

### Admin Check
```
1. User makes admin request
2. Backend verifies JWT
3. Backend checks isAdmin flag
4. If true, request proceeds
5. If false, 403 error returned
```

---

## 3D Customization Workflow

### Model Loading
```
1. User selects product
2. GLB file loaded from /public/models/
3. Three.js renders model in canvas
4. OrbitControls enabled for rotation
5. Default color applied
```

### Color Change
```
1. User clicks color picker
2. Color value updated in state
3. Material.color updated in real-time
4. Model re-renders with new color
```

### Decal Application
```
1. User selects decal area
2. User uploads image or uses AI
3. Image converted to texture
4. Texture mapped to specific model coordinates
5. Decal applied to model surface
```

### AI Generation
```
1. User enters text prompt
2. Request sent to backend
3. Backend calls OpenAI DALL-E API
4. Image generated
5. Image uploaded to Cloudinary
6. URL returned to frontend
7. Image used as decal
```

### Add to Cart
```
1. User clicks "Add to Cart"
2. Canvas rendered to base64 image
3. Customization data collected
4. Item added to Valtio state
5. State saved to localStorage
6. Success feedback shown
```

---

## State Management

### Global State (Valtio)

#### Customization State (`/store/index.js`)
```javascript
{
  intro: true,              // Show home screen
  color: '#EFBD48',        // Current color
  isLogoTexture: true,     // Logo decal enabled
  isFullTexture: false,    // Full texture enabled
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',
  // ... other decals
}
```

#### Cart State (`/store/cartStore.js`)
```javascript
{
  items: [],               // Cart items
  isCartOpen: false,       // Cart modal visibility
  totalItems: 0,           // Total quantity
  totalPrice: 0            // Total cost
}
```

#### Auth State (`/store/authStore.js`)
```javascript
{
  user: null,              // User object
  token: null,             // JWT token
  isAuthenticated: false,  // Login status
  loading: false,          // API call status
  error: null              // Error message
}
```

### Local Storage
- `token` - JWT authentication token
- `cartItems` - Shopping cart data
- `selectedModel` - Currently selected 3D model

---

## File Structure

```
project/
├── client/                     # Frontend
│   ├── public/
│   │   ├── models/            # 3D GLB files
│   │   └── assets/            # Images
│   ├── src/
│   │   ├── assets/            # Icons, images
│   │   ├── canvas/            # 3D components
│   │   │   ├── index.jsx      # Main canvas
│   │   │   ├── ModelViewer.jsx # 3D model
│   │   │   └── Backdrop.jsx   # Lighting
│   │   ├── components/        # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CartModal.jsx
│   │   │   ├── ColorPicker.jsx
│   │   │   ├── FilePicker.jsx
│   │   │   ├── AIPicker.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Customizer.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminOrders.jsx
│   │   ├── store/             # State management
│   │   │   ├── index.js       # Customization state
│   │   │   ├── cartStore.js   # Cart state
│   │   │   └── authStore.js   # Auth state
│   │   ├── config/            # Configuration
│   │   │   ├── constants.js
│   │   │   ├── motion.js      # Animations
│   │   │   └── helpers.js
│   │   ├── App.jsx            # Main app + routing
│   │   └── main.jsx           # Entry point
│   └── package.json
│
├── server/                     # Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── admin.js           # Admin check
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── contact.js
│   │   └── dalle.routes.js
│   ├── index.js               # Server entry point
│   ├── package.json
│   └── .env                   # Environment variables
│
└── README.md
```

---

## Environment Variables

### Server `.env`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_random_secret_key
OPENAI_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## How 3D Rendering Works

### 1. Scene Setup
- Canvas created with `<Canvas>` component
- Camera positioned to view model
- Lights added for visibility

### 2. Model Loading
- GLB file loaded using `useGLTF` hook
- Model geometry and materials extracted
- Model centered in scene

### 3. Material Customization
- Base color changed by updating `material.color`
- Textures loaded from uploaded images
- Textures mapped to UV coordinates

### 4. Controls
- OrbitControls for mouse rotation
- Touch controls for mobile
- Zoom in/out with scroll

### 5. Rendering
- Three.js renders scene at 60 FPS
- WebGL used for hardware acceleration
- Shadow and lighting updated in real-time

---

## How Orders Work

### Order Creation
```
1. User clicks "Place Order"
2. Cart items sent to backend
3. Order document created in MongoDB
4. Product stock reduced (if not customized)
5. Order ID returned to frontend
6. User redirected to confirmation page
```

### Order Status Flow
```
Pending → Processing → Shipped → Delivered
                ↓
            Cancelled (anytime)
```

### Auto-Paid on Delivery
When admin changes status to "Delivered":
- `isPaid` set to `true`
- `paidAt` set to current date
- `isDelivered` set to `true`
- `deliveredAt` set to current date

---

## Security Measures

### Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Compare using `bcrypt.compare()`

### Authentication
- JWT tokens expire (configurable)
- Tokens verified on each protected request
- Tokens stored in localStorage (client-side)

### Authorization
- Admin routes protected with `admin` middleware
- User can only view their own orders
- CORS enabled for allowed origins

### Input Validation
- Required fields enforced in schemas
- Email format validated
- Mongoose schema validation

---

## Performance Considerations

### Frontend
- Vite for fast builds and HMR
- React lazy loading (not implemented yet)
- LocalStorage for cart persistence
- Debounced color picker (not implemented yet)

### Backend
- MongoDB indexing on email field
- Mongoose lean queries (not implemented yet)
- Express compression (not implemented yet)

### 3D Rendering
- Low-poly models for performance
- Texture resolution optimized
- Shadow quality balanced for speed

---

## Current Limitations

1. **No Payment Gateway** - Only "Cash on Delivery" works
2. **No Email Notifications** - Order confirmations not sent
3. **No Admin Contact UI** - Contact messages in DB only
4. **No Product Reviews** - Feature not implemented
5. **No Search** - Manual browsing only
6. **No User Profile** - Basic auth only
7. **Single Currency** - PKR only
8. **No Inventory Alerts** - Stock not tracked in real-time

---

## Testing

### Manual Testing Checklist

**User Flow:**
- [ ] Sign up new account
- [ ] Sign in existing user
- [ ] Browse products
- [ ] Customize product in 3D
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] Complete checkout
- [ ] View order history
- [ ] Submit contact form

**Admin Flow:**
- [ ] Sign in as admin
- [ ] View dashboard
- [ ] Add new product
- [ ] Edit product
- [ ] Delete product
- [ ] View all orders
- [ ] Update order status
- [ ] Filter orders by status

### API Testing
Use Postman or cURL to test endpoints.

Example:
```bash
# Create user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# Get products
curl http://localhost:8080/api/products
```

---

## Deployment Notes

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB cluster
- [ ] Update CORS origins
- [ ] Secure JWT secret
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Compress responses
- [ ] Add rate limiting
- [ ] Set up error logging
- [ ] Configure CDN for static assets

### Environment Setup
1. **Frontend:** Deploy to Vercel/Netlify
2. **Backend:** Deploy to Railway/Render/Heroku
3. **Database:** MongoDB Atlas (already cloud)
4. **Images:** Cloudinary (already cloud)

---

## Maintenance

### Regular Tasks
- Monitor MongoDB Atlas usage
- Check Cloudinary storage limits
- Review error logs
- Update dependencies
- Backup database

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update major versions carefully
npm install package@latest
```

---

## Troubleshooting

### Common Issues

**Issue:** Cannot connect to MongoDB
**Fix:** Check `MONGODB_URI` in `.env`, verify network access in Atlas

**Issue:** JWT errors
**Fix:** Check `JWT_SECRET` is set, verify token in localStorage

**Issue:** 3D model not loading
**Fix:** Verify GLB file exists in `/public/models/`, check file path

**Issue:** Images not uploading
**Fix:** Verify Cloudinary credentials, check image size limit

**Issue:** CORS errors
**Fix:** Ensure backend CORS allows frontend origin

---

## Development Setup

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account
- OpenAI API key (optional)
- Cloudinary account (optional)

### Installation
```bash
# Clone repository
git clone <repo-url>
cd fashion-forge

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Running Locally
```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend
cd client
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Admin login: admin@fashionforge.com / admin123

---

## Key Metrics

**Current Stats:**
- 13 Products
- 4 Product Categories
- 9 Decal Placement Areas
- 8 Routes (pages)
- 4 Database Collections
- 2 User Roles (User, Admin)
- 5 Order Status Types

---

## Conclusion

Fashion Forge is a full-stack web application that combines:
- 3D graphics with Three.js
- E-commerce functionality
- AI-powered design tools
- User authentication
- Admin management

The system is functional for basic operations but has room for enhancement in payment processing, email notifications, and advanced features.

---

**Version:** 2.1.0
**Last Updated:** November 23, 2025
**Maintained By:** [Your Team]
