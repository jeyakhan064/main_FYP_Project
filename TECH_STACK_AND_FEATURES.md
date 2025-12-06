# Fashion Forge - Tech Stack & Features Documentation

## Project Overview
Fashion Forge is an e-commerce platform for customized apparel with real-time 3D visualization and AI-powered design generation. Users can select garment models, customize colors, apply designs to specific areas, and generate AI designs using text prompts.

---

## Tech Stack

### Frontend

#### Core Framework
- **React 19.1.0** - UI component library for building the user interface
- **Vite 4.2.0** - Build tool for faster development and optimized production builds
- **React Router DOM 7.6.0** - Client-side routing for navigation between pages

#### 3D Graphics & Visualization
- **Three.js 0.175.0** - JavaScript 3D library for rendering 3D models in the browser
- **React Three Fiber 9.1.1** - React renderer for Three.js, allows declarative 3D scene composition
- **React Three Drei 10.0.5** - Helper components for React Three Fiber (OrbitControls, Center, etc.)
- **three-mesh-bvh 0.9.0** - Bounding volume hierarchy for optimized raycasting on 3D models

#### State Management & Animation
- **Valtio 1.10.3** - Proxy-based state management for reactive global state
- **Framer Motion 10.9.4** - Animation library for smooth UI transitions and micro-interactions

#### Styling & UI
- **Tailwind CSS 3.3.0** - Utility-first CSS framework for responsive design
- **PostCSS 8.4.21** - CSS transformations
- **Autoprefixer 10.4.14** - Automatic vendor prefixing for cross-browser compatibility
- **React Color 2.19.3** - Color picker component for garment color customization

#### Math & Utilities
- **maath 0.5.3** - Math helpers for 3D calculations and transformations

### Backend

#### Server Framework
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web application framework for building REST API
- **Nodemon 2.0.22** - Development tool for auto-restarting server on code changes

#### Database
- **MongoDB** - NoSQL database for storing users, products, orders, and contact messages
- **Mongoose 7.8.7** - ODM (Object Data Modeling) library for MongoDB

#### Authentication & Security
- **bcryptjs 3.0.3** - Password hashing for secure user authentication
- **jsonwebtoken 9.0.2** - JWT-based authentication for stateless sessions
- **express-validator 7.3.1** - Request validation middleware

#### AI Integration
- **Pollinations.AI API** - Free AI image generation service (no API key required)
  - Model: Flux
  - Resolution: 1024x1024
  - Features: Logo removal, prompt enhancement
- **Axios** - HTTP client for making API requests to Pollinations.AI

#### Cloud Services
- **Cloudinary 1.35.0** - Cloud-based image storage and delivery (planned for future use)

#### Environment & Configuration
- **dotenv 16.6.1** - Environment variable management
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware for API security

---

## Features Implemented

### 1. 3D Model Viewer
**What it does:** Displays interactive 3D garment models that users can rotate and view from any angle.

**How it works:**
- Uses React Three Fiber to render GLB/GLTF 3D models
- OrbitControls allow rotation via mouse drag (zoom and pan disabled)
- Camera positioned at [0, 0, 10] with 45° field of view
- Hemisphere lighting and directional lights for realistic rendering
- White background for clean product visualization

**Why:**
- Provides realistic product preview before purchase
- Allows customers to inspect garments from all angles
- Enhances user confidence in online shopping

**Technical Implementation:**
- Models loaded from `/models/` directory
- Auto-scaling with React Three Drei's `<Center>` component
- Fixed canvas positioning to avoid UI conflicts
- Model-specific position adjustments for proper framing

**Models Supported:**
- Women's Top
- T-Shirt
- Varsity Jacket
- Pants

---

### 2. Dynamic Decal System
**What it does:** Allows users to apply custom designs to specific areas of garments (full coverage, back, sleeves, belt area).

**How it works:**
- Uses Three.js `<Decal>` component to project 2D textures onto 3D surfaces
- Each model has predefined decal positions and scales in `decalpositions.js`
- Automatic scale calculation based on model dimensions for consistent sizing
- Toggle system to show/hide individual decals

**Why:**
- Enables personalized garment customization
- Supports different design placements for creative freedom
- Maintains design quality across different model sizes

**Technical Implementation:**
- Raycasting to find optimal projection points on mesh geometry
- Euler rotation for proper decal orientation
- Model-specific configurations:
  - **Shirts/Jackets**: Full, Back, L-Sleeve, R-Sleeve
  - **Pants**: Belt area, Full coverage
- Scale formulas:
  - Full coverage: `width × 1.3` (covers entire front including sleeves)
  - Sleeves: `height × sleeveMultiplier`
  - Pants collar (full): scale 2.6

**Position Calculation:**
- Bounding box analysis to determine model dimensions
- Center point calculation for proper decal alignment
- Z-offset adjustments for surface projection

---

### 3. AI Design Generator
**What it does:** Generates custom designs from text descriptions using AI and applies them to selected garment areas.

**How it works:**
- User enters text prompt (e.g., "abstract colorful patterns")
- Frontend sends prompt to backend `/api/v1/dalle` endpoint
- Backend calls Pollinations.AI API with encoded prompt
- AI generates 1024×1024 image
- Image converted to base64 and sent to frontend
- Frontend applies image as decal texture

**Why:**
- Removes need for external design tools or files
- Enables non-designers to create custom apparel
- Provides instant visual results
- No API costs (Pollinations.AI is free)

**Technical Implementation:**
- **Prompt Enhancement**: Users can add variation modifiers for regeneration
- **Contextual Prompts**: Pre-defined templates for cultural designs:
  - Pakhtoon: Traditional tribal motifs
  - Sindhi: Ajrak geometric patterns
  - Tribal: Ethnic cultural designs
  - Abstract, Geometric, Vintage, Floral, Animal, Space, Urban
- **Retry Logic**: 3 automatic retries with 2-second delays on failure
- **Timeout**: 60-second limit per request
- **Error Handling**: Specific responses for timeout, rate limit, and generation failures

**Position Selection:**
- Dropdown to choose where AI design appears (Full/Back/L-Sleeve/R-Sleeve)
- Model-aware: Pants show "Belt" and "Full Coverage" options instead

**Regeneration Feature:**
- Keeps same prompt but generates different variations
- Adds modifiers: "alternative style", "different perspective", "unique variation", etc.
- Tracks regeneration count to cycle through modifiers

---

### 4. Color Customization
**What it does:** Allows users to change the base color of the garment in real-time.

**How it works:**
- React Color picker component for color selection
- Selected color stored in Valtio global state
- ModelViewer applies color to material in 3D scene
- Color persists when switching between pages

**Why:**
- Instant visual feedback for color choices
- No need to browse multiple product listings
- Reduces decision-making time

**Technical Implementation:**
- Default color: #EFBD48 (brand yellow)
- Color applied to material's `color` property
- Reactive updates via Valtio proxy

---

### 5. File Upload System
**What it does:** Users can upload their own images (PNG, JPG, etc.) and apply them as decals.

**How it works:**
- HTML file input restricted to `image/*` types
- FileReader API converts image to base64 data URL
- User selects target area (Full/Back/L-Sleeve/R-Sleeve)
- Image applied as decal texture
- Toggle automatically enabled for selected area

**Why:**
- Supports users with existing designs
- No dependency on AI for custom graphics
- Enables use of logos, photos, or pre-made artwork

**Technical Implementation:**
- Model-aware button display (Belt/Full for pants, standard positions for others)
- Base64 encoding for compatibility with Three.js textures
- File size handled in-memory (no server upload)

---

### 6. Canvas Download
**What it does:** Exports the current 3D view as a high-quality PNG image.

**How it works:**
- Captures canvas using `toDataURL('image/png')`
- Creates temporary download link
- Triggers browser download with filename `canvas.png`
- Auto-cleanup of temporary link

**Why:**
- Users can save their designs for reference
- Useful for sharing designs before purchase
- No server-side processing required

**Technical Implementation:**
- Uses Three.js `preserveDrawingBuffer: true` option
- Client-side image generation
- Immediate download without page reload

---

### 7. E-commerce Integration

#### Shopping Cart
**What it does:** Users can add customized garments to cart for checkout.

**How it works:**
- Captures current 3D canvas snapshot
- Stores full customization state (color, decals, model)
- Creates cart item with:
  - Unique ID (timestamp-based)
  - Product name, price (PKR 8,999)
  - Canvas snapshot as product image
  - Complete customization data for manufacturing
- Valtio cart store manages cart state
- Visual feedback (green checkmark) on successful add

**Why:**
- Preserves exact customization for order fulfillment
- Allows multiple custom items in single order
- Provides clear visual confirmation

**Technical Implementation:**
- Canvas snapshot converted to PNG data URL
- Customization object stores all decal states
- Cart persists across page navigation
- 2-second confirmation animation

#### Product Catalog
**What it does:** Displays pre-made products available for purchase without customization.

**How it works:**
- Products stored in MongoDB with name, description, price, image URL, category
- REST API endpoints for CRUD operations
- Admin panel for product management
- Users browse catalog and add to cart

**Why:**
- Provides ready-to-buy options for users who don't want customization
- Showcases existing designs
- Standard e-commerce functionality

---

### 8. Authentication System
**What it does:** Secure user registration, login, and session management.

**How it works:**
- **Registration**: User provides name, email, password
  - Password hashed with bcrypt (10 salt rounds)
  - User document created in MongoDB
  - JWT token generated and returned
- **Login**: Email/password verification
  - bcrypt compares hashed passwords
  - JWT token issued on success
- **Password Reset**: Email-based password recovery (planned)
- **Role-based Access**: Admin flag for dashboard access

**Why:**
- Protects user accounts and order history
- Enables personalized experiences
- Restricts admin features to authorized users

**Technical Implementation:**
- JWT tokens for stateless authentication
- express-validator for input sanitization
- Middleware for protected routes
- Valtio auth store for client-side auth state

---

### 9. Order Management

#### Customer Orders
**What it does:** Users can view their order history and track status.

**How it works:**
- Orders stored in MongoDB with user reference
- Each order contains:
  - Customer info (name, email, address, phone)
  - Items array (product details, quantity, price)
  - Total amount, payment status, order status
  - Timestamps
- REST API filters orders by authenticated user
- Frontend displays orders in reverse chronological order

**Why:**
- Transparency in purchase history
- Order tracking for delivery
- Customer service reference

#### Admin Order Dashboard
**What it does:** Admin panel to view all orders and update status.

**How it works:**
- Protected route requiring admin authentication
- Displays all orders across all users
- Status update functionality (Pending → Processing → Shipped → Delivered)
- Real-time status changes reflected in customer view

**Why:**
- Order fulfillment workflow
- Customer service management
- Business operations visibility

---

### 10. Contact Form
**What it does:** Allows users to send messages/inquiries to business.

**How it works:**
- Form collects name, email, message
- POST request to `/api/contact`
- Message stored in MongoDB contacts collection
- Confirmation shown to user

**Why:**
- Customer support channel
- Lead generation
- User feedback collection

---

### 11. Responsive UI/UX

#### Layout System
- Fixed header with logo and account dropdown
- Sidebar panels for color picker and file upload (left)
- AI generator panel (right side)
- Bottom-centered toggle controls for decal visibility
- Transparent glass-morphism styling for panels

#### Animations
- Framer Motion for smooth page transitions
- Panel slide-in animations
- Button hover effects
- Loading spinners during AI generation

#### Pointer Event Management
**Problem:** Canvas overlay blocking UI button clicks while needing to capture rotation events.

**Solution:**
- Transparent blocking zones positioned over UI panels at z-index 40
- Canvas wrapper with `pointer-events: none`
- Canvas element re-enables pointer events via `onCreated` callback
- Center area remains interactive for model rotation
- UI buttons receive clicks through blocking zones

**Why:**
- Enables simultaneous UI interaction and 3D model rotation
- No trade-off between functionality
- Clean user experience without mode switching

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset (planned)

### AI Generation
- `GET /api/v1/dalle` - Health check
- `POST /api/v1/dalle` - Generate AI image from prompt

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user's orders (authenticated)
- `POST /api/orders` - Create new order
- `GET /api/orders/admin` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Contact
- `POST /api/contact` - Submit contact form

---

## State Management Architecture

### Global State (Valtio)
```javascript
{
  intro: true,              // Homepage vs Customizer view
  color: "#EFBD48",         // Garment base color
  selectedModel: "/path",   // Active 3D model

  // Decal toggles (visibility)
  isFullTexture: false,
  isBackTexture: false,
  isLeftSleeveTexture: false,
  isRightSleeveTexture: false,
  isCollarTexture: false,    // Pants full coverage

  // Decal images (base64 or URLs)
  fullDecal: "",
  backDecal: "",
  leftSleeveDecal: "",
  rightSleeveDecal: "",
  collarDecal: "",
}
```

### Local Storage
- `selectedModel` - Persists selected garment across sessions

### Auth Store (Valtio)
```javascript
{
  isAuthenticated: false,
  user: { name, email, isAdmin },
  token: null
}
```

### Cart Store (Valtio)
```javascript
{
  items: [
    {
      id, name, model, image, price,
      isCustomized: true,
      customization: { color, decals, canvasSnapshot }
    }
  ]
}
```

---

## Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique, required),
  password: String (hashed),
  isAdmin: Boolean (default: false),
  createdAt: Date
}
```

### Products
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String (URL),
  category: String,
  stock: Number,
  createdAt: Date
}
```

### Orders
```javascript
{
  user: ObjectId (ref: User),
  customerName: String,
  email: String,
  address: String,
  phone: String,
  items: [{
    product: ObjectId or custom data,
    quantity: Number,
    price: Number,
    customization: Object (optional)
  }],
  totalAmount: Number,
  paymentStatus: String (enum: pending/paid),
  orderStatus: String (enum: pending/processing/shipped/delivered),
  createdAt: Date
}
```

### Contacts
```javascript
{
  name: String,
  email: String,
  message: String,
  createdAt: Date
}
```

---

## Performance Optimizations

### 3D Rendering
- Auto-scaling prevents oversized/undersized models
- Disabled zoom and pan reduces user confusion
- Fixed camera position for consistent framing
- Efficient lighting setup (hemisphere + 3 directional lights, no shadows)

### State Management
- Valtio proxy for minimal re-renders
- Only components using specific state values update
- Reactive subscriptions via `useSnapshot`

### Image Handling
- Base64 encoding for immediate display
- No separate image upload API calls
- Client-side processing reduces server load

### API Efficiency
- 60-second timeout prevents hanging requests
- Retry logic (3 attempts) handles transient failures
- Pollinations.AI (free) eliminates API costs

---

## Security Measures

### Password Security
- bcrypt hashing with 10 salt rounds
- Plain passwords never stored

### API Security
- CORS enabled for controlled access
- JWT tokens for stateless auth
- express-validator prevents injection attacks
- Protected routes require authentication

### Input Validation
- Email format validation
- Password strength requirements (planned enhancement)
- Request body size limits (50MB for images)

---

## Future Enhancements (Planned)

1. **Payment Integration** - Stripe/PayPal for checkout
2. **Email Notifications** - Order confirmations, shipping updates
3. **Cloudinary Integration** - Store generated designs in cloud
4. **Advanced AI Features** - Style transfer, background removal
5. **More Decal Positions** - Pockets, hoods, tags, collars
6. **Model Expansion** - Hoodies, jackets, dresses, accessories
7. **Social Sharing** - Share designs on social media
8. **Design Templates** - Curated design library
9. **Bulk Ordering** - Corporate/team orders
10. **Mobile App** - React Native version

---

## Development Workflow

### Local Development
```bash
# Frontend (Vite dev server)
cd client
npm run dev
# Runs on http://localhost:5173 (or next available port)

# Backend (Express + Nodemon)
cd server
npm start
# Runs on http://localhost:8080
```

### Build for Production
```bash
cd client
npm run build
# Generates optimized static files in client/dist
```

### Environment Variables
```
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/fashion-forge
JWT_SECRET=your_secret_key
PORT=8080
```

---

## Project Structure
```
main_FYP_Project/
├── client/                    # Frontend React app
│   ├── public/
│   │   ├── models/           # 3D GLB files
│   │   └── logo.png
│   ├── src/
│   │   ├── canvas/           # 3D rendering components
│   │   │   ├── index.jsx     # Canvas wrapper
│   │   │   └── ModelViewer.jsx  # 3D model + decals
│   │   ├── components/       # Reusable UI components
│   │   │   ├── AIPicker.jsx
│   │   │   ├── ColorPicker.jsx
│   │   │   ├── CustomButton.jsx
│   │   │   ├── FilePicker.jsx
│   │   │   └── Header.jsx
│   │   ├── config/          # Configuration files
│   │   │   ├── constants.js
│   │   │   ├── decalpositions.js
│   │   │   ├── helpers.js
│   │   │   └── sleeveScales.js
│   │   ├── pages/           # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Customizer.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── store/           # State management
│   │   │   ├── index.js     # Main Valtio store
│   │   │   ├── authStore.js
│   │   │   └── cartStore.js
│   │   ├── utils/           # Utility functions
│   │   │   └── decalPositionCalculator.js
│   │   └── App.jsx          # Main app component
│   └── package.json
│
├── server/                   # Backend Node.js app
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Contact.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js
│   │   ├── dalle.routes.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── contact.js
│   ├── middleware/          # Auth middleware
│   ├── index.js             # Server entry point
│   └── package.json
│
└── README.md
```

---

## Key Technical Decisions

### Why React Three Fiber over vanilla Three.js?
- Declarative syntax matches React patterns
- Automatic cleanup of 3D resources
- Easier state integration
- Better developer experience

### Why Valtio over Redux/Context?
- Simpler API with less boilerplate
- Proxy-based reactivity
- Fine-grained updates
- No actions/reducers needed

### Why Pollinations.AI over DALL-E/Midjourney?
- No API costs (100% free)
- No API key required
- Good quality for garment designs
- No usage limits

### Why MongoDB over SQL?
- Flexible schema for customization data
- Easy to store nested objects (decal configurations)
- JSON-like documents match JavaScript objects
- Horizontal scalability

### Why JWT over session cookies?
- Stateless authentication
- Works across multiple servers
- Mobile app compatible
- Easier to scale

---

## Challenges Solved

### 1. Canvas Pointer Event Conflict
**Problem:** Canvas covering viewport blocked UI button clicks.
**Solution:** Layered pointer-event system with transparent blocking zones over UI areas.

### 2. Decal Positioning Consistency
**Problem:** Decals appeared at different sizes/positions across models.
**Solution:** Automatic scale calculation based on bounding box dimensions with model-specific overrides.

### 3. AI Generation Reliability
**Problem:** Pollinations.AI occasionally times out.
**Solution:** Retry logic with exponential backoff and clear error messages.

### 4. Model Framing
**Problem:** Different models had varying vertical positions.
**Solution:** Model-specific position adjustments in ModelViewer component.

### 5. Decal Toggle Conflicts
**Problem:** Multiple decals in same area caused visual overlap.
**Solution:** Independent toggle system allowing selective visibility control.

---

## Testing Approach

### Manual Testing
- Cross-browser testing (Chrome, Firefox, Edge)
- Different model types (shirts, pants)
- Various decal combinations
- AI generation with different prompts
- Cart and checkout flow
- Admin panel operations

### Performance Testing
- 3D model load times
- AI generation response times
- Canvas rendering frame rates
- Large cart operations

---

## Conclusion

Fashion Forge combines modern web technologies to create an interactive e-commerce platform that bridges the gap between online shopping and physical customization. The tech stack was chosen for developer experience, performance, and cost-effectiveness, while features were implemented based on real user needs in the custom apparel market.

The project demonstrates:
- Advanced 3D web graphics
- AI integration for creative tools
- Full-stack development with MERN stack
- Real-time state management
- Responsive UI/UX design
- E-commerce fundamentals

All implementations prioritize simplicity, maintainability, and user experience over unnecessary complexity.
