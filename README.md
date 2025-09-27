# Sri Lankan Spices Web Application

A full-stack web application for a Sri Lankan spices marketplace with role-based authentication and comprehensive dashboards.

## 🌟 Features

### Authentication & Roles
- **Buyer**: Browse and purchase spices, manage orders, submit support tickets
- **Seller**: Manage products, view received orders, update order status
- **Support Agent**: Handle customer support tickets, manage customer inquiries

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide React Icons
- **Backend**: Node.js + Express.js + MongoDB + Mongoose
- **Authentication**: JWT-based authentication
- **UI**: Modern, responsive design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally (default: mongodb://localhost:27017)
- Git

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd "c:\Users\adeep\Desktop\Spices latest"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   The backend `.env` file is configured to use MongoDB Atlas (cloud database). 
   
   **To set up MongoDB Atlas:**
   1. See the detailed guide in `MONGODB_ATLAS_SETUP.md`
   2. Create a free MongoDB Atlas account
   3. Create a cluster and database user
   4. Get your connection string
   5. Replace the MONGODB_URI in `.env` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/spices_db?retryWrites=true&w=majority
   ```

5. **Database Setup (MongoDB Atlas)**
   No local MongoDB installation required! The app uses MongoDB Atlas cloud database.
   mongod
   ```

6. **Seed Support Agent (Optional)**
   ```bash
   cd backend
   node seedSupport.js
   ```

7. **Start the Application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

8. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👥 User Accounts

### Support Agent (Pre-configured)
- **Email**: support@gmail.com
- **Password**: support@123

### Create New Accounts
- Visit http://localhost:3000/register
- Choose **Buyer** or **Seller** role
- Fill in the registration form

## 📱 Application Structure

### Buyer Dashboard (4 Tabs)
1. **Products** - Browse and order spices from sellers
2. **My Purchases** - View order history and status
3. **Support** - Submit and manage support tickets
4. **Profile** - Update personal information

### Seller Dashboard (3 Tabs)
1. **My Products** - Add, edit, and manage spice products
2. **Received Orders** - View and process customer orders
3. **Profile** - Update seller information

### Support Agent Dashboard (3 Tabs)
1. **Under Reviewing** - Assign unassigned tickets to self
2. **Reviewed** - Manage assigned tickets and respond to customers
3. **Profile** - Update support agent information

## 🛠️ Key Features

### For Buyers
- Browse products with search and filters
- One-click ordering system
- Order tracking and history
- Support ticket system
- Profile management

### For Sellers
- Product management (CRUD operations)
- Stock management
- Order status updates
- Sales analytics
- Profile management

### For Support Agents
- Ticket assignment system
- Customer communication
- Ticket status management
- Support analytics
- Profile management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (public)
- `POST /api/seller/products` - Create product (seller)
- `PUT /api/seller/products/:id` - Update product (seller)
- `DELETE /api/seller/products/:id` - Delete product (seller)

### Orders
- `POST /api/buyer/orders` - Create order (buyer)
- `GET /api/buyer/orders` - Get buyer orders
- `GET /api/seller/orders` - Get seller orders
- `PATCH /api/seller/orders/:id/status` - Update order status

### Support
- `POST /api/buyer/support/tickets` - Create ticket (buyer)
- `GET /api/support/tickets/under-review` - Get unassigned tickets
- `GET /api/support/tickets/assigned` - Get assigned tickets
- `PATCH /api/support/tickets/:id/assign` - Assign ticket
- `POST /api/support/tickets/:id/messages` - Add message

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Icons** - Lucide React icons throughout
- **Loading States** - Smooth loading indicators
- **Toast Notifications** - Real-time feedback
- **Form Validation** - Client and server-side validation
- **Role-based Navigation** - Different interfaces for each role

## 🔐 Security Features

- JWT token authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Environment variable configuration

## 📦 Production Deployment

1. **Environment Variables**
   - Update `JWT_SECRET` with a strong secret key
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   - Deploy backend to your preferred hosting service
   - Deploy frontend build files to a static hosting service
   - Ensure MongoDB is accessible from your backend

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Atlas Connection Error**
   - Check your internet connection
   - Verify MongoDB Atlas connection string in `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas Network Access
   - Check username/password in connection string
   - Make sure your MongoDB Atlas cluster is active (not paused)

2. **Port Already in Use**
   - Change ports in `.env` (backend) or `vite.config.js` (frontend)
   - Kill existing processes using the ports

3. **CORS Issues**
   - Ensure frontend and backend URLs are correctly configured
   - Check proxy settings in `vite.config.js`

4. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## 📄 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use cases.

---

**Enjoy exploring the Sri Lankan Spices Marketplace! 🌶️**
