import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  ShoppingCart, 
  MessageCircle, 
  User, 
  LogOut,
  Star,
  Plus,
  Eye,
  Search,
  Filter,
  Download,
  FileText,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// CSS Animations for Modal
const modalStyles = `
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);
}

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'purchases', label: 'My Purchases', icon: ShoppingCart },
    { id: 'support', label: 'Support', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/buyer/${tabId}`);
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border-b border-orange-200/40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">🌶️</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Ceylon Spices - Buyer Dashboard
              </h1>
            </div>
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50 bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 bg-white/60 px-4 py-2 rounded-2xl shadow-sm">
              Welcome, <span className="font-semibold text-orange-600">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-red-600 bg-white/50 hover:bg-red-50 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Tab Component
const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [categories, setCategories] = useState([]);
  const [orderModal, setOrderModal] = useState({ show: false, product: null });
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    shippingAddress: {
      street: '',
      city: '',
      postalCode: '',
      phone: '',
      country: 'Sri Lanka'
    },
    notes: ''
  });

  // Initial load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Debounced search effect
  useEffect(() => {
    console.log('Filters changed:', filters); // Debug log
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add search parameter if it exists
      if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim());
      }
      
      // Add other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (key !== 'search' && value && value !== 'all') {
          params.append(key, value);
        }
      });

      console.log('Fetching products with params:', params.toString()); // Debug log
      const response = await axios.get(`/products?${params}`);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error); // Debug log
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/products/meta/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleOrder = async (product) => {
    setOrderModal({ show: true, product });
    setOrderForm(prev => ({
      ...prev,
      quantity: 1,
      shippingAddress: {
        street: '',
        city: '',
        postalCode: '',
        phone: '',
        country: 'Sri Lanka'
      },
      notes: ''
    }));
  };

  const submitOrder = async () => {
    try {
      if (!orderModal.product) return;

      // Validate form
      if (!orderForm.shippingAddress.street || !orderForm.shippingAddress.city || 
          !orderForm.shippingAddress.postalCode || !orderForm.shippingAddress.phone) {
        toast.error('Please fill in all shipping address fields');
        return;
      }

      const orderData = {
        items: [{
          product: orderModal.product._id,
          quantity: parseInt(orderForm.quantity),
          price: orderModal.product.price
        }],
        shippingAddress: orderForm.shippingAddress,
        notes: orderForm.notes
      };

      console.log('Submitting order:', orderData); // Debug log
      const response = await axios.post('/buyer/orders', orderData);
      console.log('Order response:', response.data); // Debug log
      
      toast.success('Order placed successfully!');
      setOrderModal({ show: false, product: null });
      
      // Refresh data
      fetchProducts();
    } catch (error) {
      console.error('Order error:', error); // Debug log
      if (error.response) {
        console.error('Error response:', error.response.data); // Debug log
        toast.error(error.response.data.message || 'Failed to place order');
      } else if (error.request) {
        toast.error('Network error - please check your connection');
      } else {
        toast.error('Failed to place order');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-spice-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Advanced Filters Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 px-8 py-6 border-b border-orange-200/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2.5 rounded-xl shadow-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
Find Your Perfect Spices
                </h3>
              </div>
              <button
                onClick={() => {
                  fetchProducts();
                  fetchCategories();
                  toast.success('Products refreshed!');
                }}
                className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                title="Refresh Products"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <RefreshCw className="w-5 h-5 relative z-10" />
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-orange-500" />
                  Search Products {filters.search && <span className="text-xs text-orange-600 ml-2">({filters.search})</span>}
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 group-hover:text-orange-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search by product name: Ceylon cinnamon, cardamom, black pepper..."
                      value={filters.search}
                      onChange={(e) => {
                        console.log('Search input changed:', e.target.value); // Debug log
                        setFilters(prev => ({ ...prev, search: e.target.value }));
                      }}
                      onKeyDown={(e) => {
                        console.log('Key pressed:', e.key); // Debug log
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2 text-red-500" />
                  Category
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product._id} className="group relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/50 via-red-300/50 to-pink-300/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"></div>
            
            {/* Main card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
              {/* Product Image Container */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                <div className="aspect-w-1 aspect-h-1 w-full h-56 relative">
                  {product.images?.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      <Package className="w-20 h-20 text-orange-300" />
                    </div>
                  )}
                </div>
                
                {/* Floating badges */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {product.category.replace('-', ' ').toUpperCase()}
                  </div>
                </div>
                
                {product.stockQuantity < 10 && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      LOW STOCK
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                {/* Title and Description */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                
                {/* Price and Weight */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      LKR {product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      per {product.weight.value}{product.weight.unit}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 px-3 py-2 rounded-xl border border-orange-200/50">
                    <span className="text-sm font-semibold text-orange-700">
                      {product.weight.value}{product.weight.unit}
                    </span>
                  </div>
                </div>

                {/* Rating and Seller */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full border border-yellow-200/50">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-semibold text-yellow-700">
                        {product.ratings.average.toFixed(1)}
                      </span>
                      <span className="text-xs text-yellow-600 ml-1">
                        ({product.ratings.count})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="w-3 h-3 mr-1" />
                    <span>by <span className="font-semibold text-gray-700">{product.seller?.name}</span></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2">
                  <button
                    onClick={() => handleOrder(product)}
                    className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 text-center py-16 px-8">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No spices found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any spices matching your criteria. Try adjusting your search filters or browse all categories.
            </p>
            <button 
              onClick={() => setFilters({ search: '', category: 'all', minPrice: '', maxPrice: '', sortBy: 'createdAt', sortOrder: 'desc' })}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Order Modal */}
      {orderModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative max-w-lg w-full">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>
            
            {/* Main modal */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/50 max-h-[90vh] overflow-hidden transform animate-scale-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500/15 via-red-500/15 to-pink-500/15 px-8 py-6 border-b border-orange-200/40">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2.5 rounded-xl shadow-lg">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                      Place Your Order
                    </h3>
                  </div>
                  <button
                    onClick={() => setOrderModal({ show: false, product: null })}
                    className="bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-600 p-2 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {orderModal.product && (
                  <div className="space-y-6">
                    {/* Enhanced Product Info */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-2xl blur opacity-40"></div>
                      <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/40 shadow-lg">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                              {orderModal.product.images?.length > 0 ? (
                                <img
                                  src={orderModal.product.images[0]}
                                  alt={orderModal.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-10 h-10 text-orange-400" />
                              )}
                            </div>
                            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              {orderModal.product.category.replace('-', ' ').toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{orderModal.product.name}</h4>
                            <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                              LKR {orderModal.product.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">per {orderModal.product.weight.value}{orderModal.product.weight.unit}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Quantity */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="text-orange-500 mr-2">📦</span>
                        Quantity
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="number"
                          min="1"
                          max={orderModal.product.stockQuantity}
                          value={orderForm.quantity}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: e.target.value }))}
                          className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl text-center text-lg font-semibold"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">Available: {orderModal.product.stockQuantity} units</p>
                    </div>

                    {/* Enhanced Shipping Address */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className="text-red-500 mr-2 text-xl">🚚</span>
                        Shipping Address
                      </h4>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <span className="text-pink-500 mr-2">🏠</span>
                          Street Address *
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <input
                            type="text"
                            value={orderForm.shippingAddress.street}
                            onChange={(e) => setOrderForm(prev => ({
                              ...prev,
                              shippingAddress: { ...prev.shippingAddress, street: e.target.value }
                            }))}
                            className="relative w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-pink-200/40 rounded-2xl text-gray-700 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <span className="text-orange-500 mr-2">🏙️</span>
                            City *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <input
                              type="text"
                              value={orderForm.shippingAddress.city}
                              onChange={(e) => setOrderForm(prev => ({
                                ...prev,
                                shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                              }))}
                              className="relative w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                              placeholder="Colombo"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <span className="text-red-500 mr-2">📮</span>
                            Postal Code *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <input
                              type="text"
                              value={orderForm.shippingAddress.postalCode}
                              onChange={(e) => setOrderForm(prev => ({
                                ...prev,
                                shippingAddress: { ...prev.shippingAddress, postalCode: e.target.value }
                              }))}
                              className="relative w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                              placeholder="10100"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <span className="text-green-500 mr-2">📞</span>
                          Phone Number *
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            value={orderForm.shippingAddress.phone}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setOrderForm(prev => ({
                                ...prev,
                                shippingAddress: { ...prev.shippingAddress, phone: digits }
                              }));
                            }}
                            className="relative w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-green-200/40 rounded-2xl text-gray-700 focus:border-green-400 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                            placeholder="0712345678"
                            title="Please enter exactly 10 digits"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter 10 digits only (e.g., 0712345678)</p>
                      </div>
                    </div>

                    {/* Enhanced Notes */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="text-purple-500 mr-2">📝</span>
                        Order Notes (Optional)
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <textarea
                          value={orderForm.notes}
                          onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                          className="relative w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-purple-200/40 rounded-2xl text-gray-700 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl resize-none"
                          placeholder="Any special instructions for your spice order..."
                        />
                      </div>
                    </div>

                    {/* Enhanced Order Total */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-blue-100/50 rounded-2xl blur opacity-40"></div>
                      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/40 shadow-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="text-green-500 mr-2">💰</span>
                            Order Total:
                          </span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            LKR {(orderModal.product.price * parseInt(orderForm.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={submitOrder}
                        className="flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Place Order</span>
                      </button>
                      <button
                        onClick={() => setOrderModal({ show: false, product: null })}
                        className="bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 hover:text-red-600 border-2 border-gray-200 hover:border-red-300 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// My Purchases Tab Component
const PurchasesTab = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search effect
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/buyer/orders');
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // CSV Export Function
  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    const csvData = [];
    
    // Add header row
    csvData.push([
      'Order Number',
      'Order Date',
      'Status',
      'Seller Name',
      'Product Name',
      'Quantity',
      'Unit Price (LKR)',
      'Subtotal (LKR)',
      'Total Amount (LKR)'
    ]);

    // Add data rows
    filteredOrders.forEach(order => {
      order.items.forEach((item, index) => {
        csvData.push([
          order.orderNumber,
          new Date(order.createdAt).toLocaleDateString(),
          order.status.charAt(0).toUpperCase() + order.status.slice(1),
          order.seller?.name || 'N/A',
          item.product?.name || 'N/A',
          item.quantity,
          item.price.toFixed(2),
          item.subtotal.toFixed(2),
          index === 0 ? order.totalAmount.toFixed(2) : '' // Only show total on first item of each order
        ]);
      });
    });

    // Convert to CSV string
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
    
    toast.success('CSV file downloaded successfully!');
  };

  // PDF Export Function
  const exportToPDF = async () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    try {
      toast.loading('Generating advanced PDF report...', { id: 'pdf-export' });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Company Header (no logo)
      pdf.setFillColor(255, 140, 0); // Orange brand bar
      pdf.rect(0, 0, pageWidth, 35, 'F');

      // Company Name and Tagline (text-only)
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('Ceylon Spices', 15, 18);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text('Premium Quality Spices from Sri Lanka', 15, 23);
      pdf.setFontSize(9);
      pdf.text('Established 1985 • ISO 22000 Certified', 15, 28);

      // Company Details Section
      yPosition = 50;
      pdf.setTextColor(0, 0, 0);
      
      // Company Details Box
      pdf.setFillColor(248, 249, 250);
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.5);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 45, 'FD');
      
      // Company Details Title
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 140, 0);
      pdf.text('COMPANY INFORMATION', 20, yPosition);
      
      yPosition += 8;
      
      // Company Details in two columns
      const leftColumn = 20;
      const rightColumn = 100;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      // Left Column
      pdf.setFont('helvetica', 'bold');
      pdf.text('Business Name:', leftColumn, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Ceylon Spices (Pvt) Ltd', leftColumn + 25, yPosition);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Registration:', leftColumn, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text('PV 123456789', leftColumn + 25, yPosition + 5);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('VAT Number:', leftColumn, yPosition + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('123456789V', leftColumn + 25, yPosition + 10);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Address:', leftColumn, yPosition + 15);
      pdf.setFont('helvetica', 'normal');
      pdf.text('123 Spice Garden Road', leftColumn + 25, yPosition + 15);
      pdf.text('Colombo 07, Sri Lanka', leftColumn + 25, yPosition + 18);
      
      // Right Column
      pdf.setFont('helvetica', 'bold');
      pdf.text('Phone:', rightColumn, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text('+94 11 234 5678', rightColumn + 15, yPosition);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Email:', rightColumn, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text('info@ceylonspices.lk', rightColumn + 15, yPosition + 5);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Website:', rightColumn, yPosition + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('www.ceylonspices.lk', rightColumn + 15, yPosition + 10);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Business Hours:', rightColumn, yPosition + 15);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Mon-Fri: 8:00 AM - 6:00 PM', rightColumn + 15, yPosition + 15);
      pdf.text('Sat: 9:00 AM - 4:00 PM', rightColumn + 15, yPosition + 18);
      
      yPosition += 50;

      // Report Title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('PURCHASE REPORT', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Enhanced Summary Section
      const totalOrders = filteredOrders.length;
      const totalAmount = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalItems = filteredOrders.reduce((sum, order) => sum + order.items.length, 0);
      const averageOrderValue = totalAmount / totalOrders;
      
      // Calculate date range
      const orderDates = filteredOrders.map(order => new Date(order.createdAt));
      const earliestDate = new Date(Math.min(...orderDates));
      const latestDate = new Date(Math.max(...orderDates));

      // Summary Box
      pdf.setFillColor(255, 248, 220);
      pdf.setDrawColor(255, 140, 0);
      pdf.setLineWidth(1);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 35, 'FD');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 140, 0);
      pdf.text('PURCHASE SUMMARY', 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      // Summary in two columns
      const summaryLeft = 20;
      const summaryRight = 100;
      
      // Left column
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Orders:', summaryLeft, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(totalOrders.toString(), summaryLeft + 25, yPosition);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Items:', summaryLeft, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text(totalItems.toString(), summaryLeft + 25, yPosition + 5);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Date Range:', summaryLeft, yPosition + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${earliestDate.toLocaleDateString()} - ${latestDate.toLocaleDateString()}`, summaryLeft + 25, yPosition + 10);
      
      // Right column
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Amount:', summaryRight, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`LKR ${totalAmount.toFixed(2)}`, summaryRight + 25, yPosition);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Average Order:', summaryRight, yPosition + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`LKR ${averageOrderValue.toFixed(2)}`, summaryRight + 25, yPosition + 5);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Report Period:', summaryRight, yPosition + 10);
      pdf.setFont('helvetica', 'normal');
      const daysDiff = Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24)) + 1;
      pdf.text(`${daysDiff} days`, summaryRight + 25, yPosition + 10);
      
      yPosition += 40;

      // Orders Details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Order Details', 15, yPosition);
      yPosition += 10;

      filteredOrders.forEach((order, orderIndex) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        // Order Header
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Order #${order.orderNumber}`, 15, yPosition);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 15, yPosition + 5);
        pdf.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 15, yPosition + 10);
        pdf.text(`Seller: ${order.seller?.name || 'N/A'}`, 15, yPosition + 15);
        pdf.text(`Total: LKR ${order.totalAmount.toFixed(2)}`, 15, yPosition + 20);
        
        yPosition += 30;

        // Order Items
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Items:', 20, yPosition);
        yPosition += 8;

        order.items.forEach((item, itemIndex) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`• ${item.product?.name || 'N/A'}`, 25, yPosition);
          pdf.text(`  Qty: ${item.quantity} × LKR ${item.price.toFixed(2)} = LKR ${item.subtotal.toFixed(2)}`, 25, yPosition + 4);
          yPosition += 12;
        });

        yPosition += 10;

        // Add separator line between orders
        if (orderIndex < filteredOrders.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.line(15, yPosition, pageWidth - 15, yPosition);
          yPosition += 10;
        }
      });

      // Professional Footer
      const footerY = pageHeight - 25;
      
      // Footer line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(15, footerY - 5, pageWidth - 15, footerY - 5);
      
      // Footer content
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.setFont('helvetica', 'normal');
      
      // Left footer
      pdf.text('Ceylon Spices (Pvt) Ltd', 15, footerY);
      pdf.text('123 Spice Garden Road, Colombo 07', 15, footerY + 3);
      pdf.text('Sri Lanka', 15, footerY + 6);
      
      // Center footer
      pdf.text('This report was generated by Ceylon Spices Purchase System', pageWidth / 2, footerY, { align: 'center' });
      pdf.text('For inquiries: info@ceylonspices.lk | +94 11 234 5678', pageWidth / 2, footerY + 3, { align: 'center' });
      
      // Right footer
      pdf.text('ISO 22000 Certified', pageWidth - 15, footerY, { align: 'right' });
      pdf.text('Established 1985', pageWidth - 15, footerY + 3, { align: 'right' });
      pdf.text('www.ceylonspices.lk', pageWidth - 15, footerY + 6, { align: 'right' });

      // Add page numbers to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Save the PDF
      const fileName = `Ceylon_Spices_Purchase_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success('Advanced PDF report generated successfully!', { id: 'pdf-export' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF report', { id: 'pdf-export' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-spice-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                My Purchases
              </h2>
            </div>
            <button
              onClick={() => {
                fetchOrders();
                toast.success('Orders refreshed!');
              }}
              className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
              title="Refresh Orders"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <RefreshCw className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 via-red-50/30 to-pink-100/30 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/70 backdrop-blur-xl border border-orange-200/30 rounded-3xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">Search Orders</h3>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative w-full px-4 py-3 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                  placeholder="Search by Order ID (e.g., ORD-12345)"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {searchTerm ? (
                <span className="text-orange-600 font-semibold">
                  {filteredOrders.length} of {orders.length} orders
                </span>
              ) : (
                <span className="text-gray-500">
                  {orders.length} total orders
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 text-center py-16 px-8">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start shopping to see your orders here. Browse our amazing collection of Ceylon spices!
            </p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 text-center py-16 px-8">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders found</h3>
            <p className="text-gray-600 mb-2">No orders match your search criteria</p>
            <p className="text-sm text-gray-500">Try searching with a different Order ID</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/50 via-red-300/50 to-pink-300/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Main card */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">📅</span>
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Seller: <span className="font-semibold text-gray-800 ml-1">{order.seller?.name}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 rounded-2xl border border-orange-200/50">
                        <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          LKR {order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl p-6 space-y-4">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-orange-500" />
                      Order Items
                    </h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-200/30 last:border-b-0">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center overflow-hidden">
                            {item.product?.images?.length > 0 ? (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-8 h-8 text-orange-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.product?.name}</h4>
                          <p className="text-sm text-gray-600">
                            Qty: <span className="font-semibold">{item.quantity}</span> × LKR {item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">LKR {item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Floating Export Buttons - Bottom Right */}
          <div className="fixed bottom-8 right-8 z-50 flex flex-col space-y-3">
            {/* CSV Export Button */}
            <button
              onClick={exportToCSV}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              title="Export to CSV"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <Download className="w-6 h-6 relative z-10" />
            </button>

            {/* PDF Export Button */}
            <button
              onClick={exportToPDF}
              className="group relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              title="Export to PDF Report"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <FileText className="w-6 h-6 relative z-10" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Support Tab Component
const SupportTab = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'other',
    priority: 'medium'
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/buyer/support/tickets');
      setTickets(response.data.tickets);
    } catch (error) {
      toast.error('Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Client-side validation
    const errors = {};
    if (!newTicket.subject || newTicket.subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    }
    if (!newTicket.description || newTicket.description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    try {
      await axios.post('/buyer/support/tickets', newTicket);
      toast.success('Support ticket created successfully!');
      setNewTicket({ subject: '', description: '', category: 'other', priority: 'medium' });
      setShowCreateForm(false);
      setValidationErrors({});
      fetchTickets();
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          backendErrors[err.path] = err.msg;
        });
        setValidationErrors(backendErrors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create ticket');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-spice-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Support Tickets
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  fetchTickets();
                  toast.success('Support tickets refreshed!');
                }}
                className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                title="Refresh Tickets"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <RefreshCw className="w-5 h-5 relative z-10" />
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(!showCreateForm);
                  setValidationErrors({});
                }}
                className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Create Ticket Form */}
      {showCreateForm && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 px-8 py-6 border-b border-orange-200/30">
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Create Support Ticket
              </h3>
            </div>
            <div className="p-8">
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-orange-500" />
                      Category
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        required
                      >
                        <option value="order">Order Issues</option>
                        <option value="product">Product Issues</option>
                        <option value="payment">Payment Issues</option>
                        <option value="account">Account Issues</option>
                        <option value="technical">Technical Issues</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-orange-400"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">⚡</span>
                      Priority
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-400"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-pink-500" />
                    Subject
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => {
                        setNewTicket(prev => ({ ...prev, subject: e.target.value }));
                        if (validationErrors.subject) {
                          setValidationErrors(prev => ({ ...prev, subject: '' }));
                        }
                      }}
                      onBlur={() => setValidationErrors(prev => ({ ...prev, subject: newTicket.subject.trim().length < 5 ? 'Subject must be at least 5 characters' : '' }))}
                      className={`relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 ${validationErrors.subject ? 'border-red-500' : 'border-pink-200/40'} rounded-2xl text-gray-700 placeholder-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl`}
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>
                  {validationErrors.subject && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {validationErrors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="text-orange-500 mr-2">📝</span>
                    Description
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => {
                        setNewTicket(prev => ({ ...prev, description: e.target.value }));
                        if (validationErrors.description) {
                          setValidationErrors(prev => ({ ...prev, description: '' }));
                        }
                      }}
                      rows={4}
                      className={`relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 ${validationErrors.description ? 'border-red-500' : 'border-orange-200/40'} rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl resize-none`}
                      placeholder="Please provide detailed information about your issue"
                      required
                    />
                  </div>
                  {validationErrors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {validationErrors.description}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    Create Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setValidationErrors({});
                    }}
                    className="bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300 font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Tickets List */}
      {tickets.length === 0 ? (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 text-center py-16 px-8">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No support tickets</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create a ticket if you need help with orders, products, or have any questions about our spices.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/50 via-red-300/50 to-pink-300/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Main card */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          #{ticket.ticketNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getStatusColor(ticket.status)}`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {ticket.subject}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">📅</span>
                        Created on {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl p-6 mb-4">
                    <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-orange-500" />
                      Category: <span className="font-semibold text-gray-800 ml-1 capitalize">{ticket.category}</span>
                    </span>
                    {ticket.assignedTo && (
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-red-500" />
                        Assigned to: <span className="font-semibold text-gray-800 ml-1">{ticket.assignedTo.name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Profile Tab Component
const ProfileTab = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'Sri Lanka'
    }
  });
  // Added validation state
  const [errors, setErrors] = useState({ name: '', phone: '' });

  // Validation helpers
  const validateName = (value) => {
    if (!value.trim()) return 'Name is required';
    if (!/^[A-Za-z\s]+$/.test(value)) return 'Only letters and spaces allowed';
    return '';
  };
  const validatePhone = (value) => {
    if (!value) return ''; // Optional field
    if (!/^\d{10}$/.test(value)) return 'Phone must be 10 digits';
    return '';
  };

  const isFormValid = () => {
    return (
      !errors.name &&
      !errors.phone &&
      profileData.name.trim() &&
      (!profileData.phone || profileData.phone.length === 10)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Final validation before submit
    const nameErr = validateName(profileData.name);
    const phoneErr = validatePhone(profileData.phone);
    setErrors({ name: nameErr, phone: phoneErr });
    if (nameErr || phoneErr) return;

    const result = await updateProfile(profileData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Profile Settings
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  // Refresh profile data from auth context
                  setProfileData({
                    name: user?.name || '',
                    phone: user?.phone || '',
                    address: {
                      street: user?.address?.street || '',
                      city: user?.address?.city || '',
                      postalCode: user?.address?.postalCode || '',
                      country: user?.address?.country || 'Sri Lanka'
                    }
                  });
                  toast.success('Profile data refreshed!');
                }}
                className="group relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                title="Refresh Profile"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <RefreshCw className="w-5 h-5 relative z-10" />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 ${
                  isEditing 
                    ? "bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300" 
                    : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white"
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Profile Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 overflow-hidden">
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-orange-500" />
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(raw)) {
                            setProfileData(prev => ({ ...prev, name: raw }));
                            setErrors(prev => ({ ...prev, name: validateName(raw) }));
                          }
                        }}
                        onBlur={() => setErrors(prev => ({ ...prev, name: validateName(profileData.name) }))}
                        className={`relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl text-gray-700 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-orange-100 ${
                          errors.name ? 'border-red-400 focus:border-red-400' : 'border-orange-200/40 focus:border-orange-400'
                        }`}
                        required
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">📞</span>
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]{10}"  // Changed from \\d* to [0-9]{10}
                          maxLength={10}
                          value={profileData.phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0,10);
                            setProfileData(prev => ({ ...prev, phone: digits }));
                            setErrors(prev => ({ ...prev, phone: validatePhone(digits) }));
                          }}
                          onBlur={() => setErrors(prev => ({ ...prev, phone: validatePhone(profileData.phone) }))
                          }
                          className={`relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl text-gray-700 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-red-100 ${errors.phone ? 'border-red-400 focus:border-red-400' : 'border-red-200/40 focus:border-red-400'}`}
                          placeholder="0712345678"
                          title="Please enter exactly 10 digits"  // Added custom title
                        />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="text-pink-500 mr-2">🏠</span>
                    Street Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <input
                      type="text"
                      value={profileData.address.street}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-pink-200/40 rounded-2xl text-gray-700 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">🏙️</span>
                      City
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={profileData.address.city}
                        onChange={(e) => setProfileData(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, city: e.target.value }
                        }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="Colombo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">📮</span>
                      Postal Code
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={profileData.address.postalCode}
                        onChange={(e) => setProfileData(prev => ({ 
                          ...prev, 
                          address: { ...prev.address, postalCode: e.target.value }
                        }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="10100"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button 
                    type="submit" 
                    disabled={!isFormValid()}
                    className={`font-semibold py-3 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      isFormValid()
                        ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300 font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Profile Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl p-6 border border-orange-200/30">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-orange-500 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">Name</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-2xl p-6 border border-red-200/30">
                    <div className="flex items-center mb-3">
                      <span className="text-red-500 mr-2">📧</span>
                      <label className="text-sm font-semibold text-gray-700">Email</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50/50 to-orange-50/50 rounded-2xl p-6 border border-pink-200/30">
                    <div className="flex items-center mb-3">
                      <span className="text-pink-500 mr-2">📞</span>
                      <label className="text-sm font-semibold text-gray-700">Phone</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl p-6 border border-orange-200/30">
                    <div className="flex items-center mb-3">
                      <span className="text-orange-500 mr-2">👤</span>
                      <label className="text-sm font-semibold text-gray-700">Role</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-2xl p-6 border border-red-200/30">
                  <div className="flex items-center mb-4">
                    <span className="text-red-500 mr-2 text-lg">🏠</span>
                    <label className="text-lg font-semibold text-gray-700">Address</label>
                  </div>
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {user?.address ? (
                      `${user.address.street}, ${user.address.city}, ${user.address.postalCode}, ${user.address.country}`
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Buyer Dashboard Component
const BuyerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    if (path && ['products', 'purchases', 'support', 'profile'].includes(path)) {
      setActiveTab(path);
    } else {
      navigate('/buyer/products', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated background elements (spice theme) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        {/* Floating spice orbs */}
        <div className="absolute top-24 left-16 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-70 animate-bounce" style={{animationDuration: '3.5s'}} />
        <div className="absolute top-1/3 right-24 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s', animationDuration: '4.2s'}} />
        <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}} />
        <div className="absolute bottom-56 right-16 w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.2s'}} />
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<ProductsTab />} />
          <Route path="/products" element={<ProductsTab />} />
          <Route path="/purchases" element={<PurchasesTab />} />
          <Route path="/support" element={<SupportTab />} />
          <Route path="/profile" element={<ProfileTab />} />
        </Routes>
      </main>
    </div>
  );
};

export default BuyerDashboard;
