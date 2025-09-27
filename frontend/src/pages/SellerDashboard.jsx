import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  ShoppingBag, 
  User, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  DollarSign,
  Upload,
  X,
  ImageIcon,
  Download,
  FileText,
  Search,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'orders', label: 'Received Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/seller/${tabId}`);
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
                Ceylon Spices - Seller Dashboard
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

// My Products Tab Component
const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'whole-spices',
    origin: 'Sri Lanka',
    weight: { value: '', unit: 'g' },
    stockQuantity: '',
    images: []
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/seller/products');
      setProducts(response.data.products);
      setStats(response.data.stats);
    } catch (error) {
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

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    // Validate name (letters & spaces only)
    if (!newProduct.name.trim() || !/^[A-Za-z\s]+$/.test(newProduct.name.trim())) {
      toast.error('Product name must contain only letters and spaces');
      return;
    }
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        weight: {
          ...newProduct.weight,
          value: parseFloat(newProduct.weight.value)
        },
        stockQuantity: parseInt(newProduct.stockQuantity)
      };

      await axios.post('/seller/products', productData);
      toast.success('Product created successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: 'whole-spices',
        origin: 'Sri Lanka',
        weight: { value: '', unit: 'g' },
        stockQuantity: '',
        images: []
      });
      setShowCreateForm(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct.name.trim() || !/^[A-Za-z\s]+$/.test(editingProduct.name.trim())) {
      toast.error('Product name must contain only letters and spaces');
      return;
    }
    try {
      const productData = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        weight: {
          ...editingProduct.weight,
          value: parseFloat(editingProduct.weight.value)
        },
        stockQuantity: parseInt(editingProduct.stockQuantity)
      };

      await axios.put(`/seller/products/${editingProduct._id}`, productData);
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      await axios.patch(`/seller/products/${productId}/toggle-status`);
      toast.success('Product status updated successfully!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/seller/products/${productId}`);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  // ProductForm will be embedded directly in the component instead of as a separate component

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-spice-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[{
          label: 'Total Products', value: stats.totalProducts || 0, icon: <Package className='w-7 h-7' />, colors: 'from-orange-500 to-red-500'
        },{
          label: 'Active Products', value: stats.activeProducts || 0, icon: <TrendingUp className='w-7 h-7' />, colors: 'from-green-500 to-emerald-500'
        },{
          label: 'In Stock', value: stats.inStockProducts || 0, icon: <Package className='w-7 h-7' />, colors: 'from-blue-500 to-cyan-500'
        },{
          label: 'Out of Stock', value: stats.outOfStockProducts || 0, icon: <Package className='w-7 h-7' />, colors: 'from-pink-500 to-rose-500'
        }].map((c,i)=> (
          <div key={i} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-orange-200/40 shadow-xl p-6 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.colors} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full blur-2xl`}></div>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${c.colors} text-white shadow-lg ring-1 ring-white/20`}> {c.icon} </div>
                <div className="text-right">
                  <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">{c.label}</p>
                  <p className={`mt-1 text-3xl font-extrabold bg-gradient-to-r ${c.colors} bg-clip-text text-transparent drop-shadow`}>{c.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative flex justify-between items-center bg-white/80 backdrop-blur-xl border border-orange-200/30 rounded-3xl shadow-2xl px-8 py-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">My Products</h2>
          <div className="flex items-center space-x-3">
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
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" /> {showCreateForm ? 'Close' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>

      {/* Create Product Form */}
      {showCreateForm && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 px-8 py-6 border-b border-orange-200/30">
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Add New Product
              </h3>
            </div>
            <div className="p-8">
              <form onSubmit={handleCreateProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-orange-500" />
                      Product Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(val)) {
                            setNewProduct(prev => ({ ...prev, name: val }));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value && !/^[A-Za-z\s]+$/.test(e.target.value)) {
                            toast.error('Only letters and spaces allowed in product name');
                          }
                        }}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="e.g. Ceylon Cinnamon"
                        title="Only letters and spaces allowed"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">📂</span>
                      Category
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        required
                      >
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="text-pink-500 mr-2">📝</span>
                    Description
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-pink-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl resize-none"
                      placeholder="Describe your product in detail..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">💰</span>
                      Price (LKR)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">⚖️</span>
                      Weight Value
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newProduct.weight.value}
                        onChange={(e) => setNewProduct(prev => ({ 
                          ...prev, 
                          weight: { ...prev.weight, value: e.target.value }
                        }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-pink-500 mr-2">📏</span>
                      Unit
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <select
                        value={newProduct.weight.unit}
                        onChange={(e) => setNewProduct(prev => ({ 
                          ...prev, 
                          weight: { ...prev.weight, unit: e.target.value }
                        }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-pink-200/40 rounded-2xl text-gray-700 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        required
                      >
                        <option value="g">Grams</option>
                        <option value="kg">Kilograms</option>
                        <option value="lb">Pounds</option>
                        <option value="oz">Ounces</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-pink-400"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">📦</span>
                      Stock Quantity
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="number"
                        min="0"
                        value={newProduct.stockQuantity}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, stockQuantity: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">🌍</span>
                      Origin
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={newProduct.origin}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, origin: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="Sri Lanka"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="text-pink-500 mr-2">🖼️</span>
                    Product Images
                  </label>
                  <div className="space-y-4">
                    {/* Image Upload Input */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-200 border-dashed rounded-xl cursor-pointer bg-orange-50/50 hover:bg-orange-100/50 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-orange-400" />
                          <p className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            files.forEach(file => {
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error('File size should be less than 5MB');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target.result;
                                setNewProduct(prev => ({
                                  ...prev,
                                  images: [...(prev.images || []), base64]
                                }));
                              };
                              reader.readAsDataURL(file);
                            });
                            e.target.value = ''; // Reset input
                          }}
                        />
                      </label>
                    </div>

                    {/* Display uploaded images */}
                    {newProduct.images && newProduct.images.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Uploaded Images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {newProduct.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedImages = newProduct.images.filter((_, i) => i !== index);
                                  setNewProduct(prev => ({ ...prev, images: updatedImages }));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    Create Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
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

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 via-orange-50/50 to-red-100/50 rounded-3xl blur-xl opacity-60"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-200/30 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-red-500/10 px-8 py-6 border-b border-pink-200/30">
              <h3 className="text-xl font-bold bg-gradient-to-r from-pink-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Edit Product
              </h3>
            </div>
            <div className="p-8">
              <form onSubmit={handleUpdateProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-orange-500" />
                      Product Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(val)) {
                            setEditingProduct(prev => ({ ...prev, name: val }));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value && !/^[A-Za-z\s]+$/.test(e.target.value)) {
                            toast.error('Only letters and spaces allowed in product name');
                          }
                        }}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="e.g. Ceylon Cinnamon"
                        title="Only letters and spaces allowed"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">📂</span>
                      Category
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        required
                      >
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="text-pink-500 mr-2">📝</span>
                    Description
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-pink-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl resize-none"
                      placeholder="Describe your product in detail..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">💰</span>
                      Price (LKR)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, price: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">⚖️</span>
                      Weight Value
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingProduct.weight.value}
                        onChange={(e) => setEditingProduct(prev => ({ 
                          ...prev, 
                          weight: { ...prev.weight, value: e.target.value }
                        }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-pink-500 mr-2">📏</span>
                      Unit
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <select
                        value={editingProduct.weight.unit}
                        onChange={(e) => setEditingProduct(prev => ({ 
                          ...prev, 
                          weight: { ...prev.weight, unit: e.target.value }
                        }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-pink-200/40 rounded-2xl text-gray-700 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                        required
                      >
                        <option value="g">Grams</option>
                        <option value="kg">Kilograms</option>
                        <option value="lb">Pounds</option>
                        <option value="oz">Ounces</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-pink-400"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">📦</span>
                      Stock Quantity
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.stockQuantity}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, stockQuantity: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-orange-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="text-red-500 mr-2">🌍</span>
                      Origin
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        value={editingProduct.origin}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, origin: e.target.value }))}
                        className="relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 border-red-200/40 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        placeholder="Sri Lanka"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="text-pink-500 mr-2">🖼️</span>
                    Product Images
                  </label>
                  <div className="space-y-4">
                    {/* Image Upload Input */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-200 border-dashed rounded-xl cursor-pointer bg-orange-50/50 hover:bg-orange-100/50 transition-colors duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-orange-400" />
                          <p className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            files.forEach(file => {
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error('File size should be less than 5MB');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target.result;
                                setEditingProduct(prev => ({
                                  ...prev,
                                  images: [...(prev.images || []), base64]
                                }));
                              };
                              reader.readAsDataURL(file);
                            });
                            e.target.value = ''; // Reset input
                          }}
                        />
                      </label>
                    </div>

                    {/* Display uploaded images */}
                    {editingProduct.images && editingProduct.images.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Uploaded Images:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {editingProduct.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedImages = editingProduct.images.filter((_, i) => i !== index);
                                  setEditingProduct(prev => ({ ...prev, images: updatedImages }));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
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

      {/* Products List */}
      {products.length === 0 ? (
        <div className="relative text-center py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-12">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-14 h-14 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No products yet</h3>
              <p className="text-gray-600 mb-6">Add your first product to start selling</p>
              <button onClick={() => setShowCreateForm(true)} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">Add Product</button>
            </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/30 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                      {product.images?.length ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <Package className="w-10 h-10 text-orange-400" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow">{product.category.replace('-', ' ')}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.isActive ? 'Active' : 'Inactive'}</span>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${product.inStock ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-2">
                      <button onClick={() => setEditingProduct(product)} className="p-2 rounded-xl bg-white/70 hover:bg-blue-50 text-gray-500 hover:text-blue-600 shadow hover:shadow-md transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggleStatus(product._id)} className="p-2 rounded-xl bg-white/70 hover:bg-green-50 text-gray-500 hover:text-green-600 shadow hover:shadow-md transition-all">
                        {product.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="p-2 rounded-xl bg-white/70 hover:bg-red-50 text-gray-500 hover:text-red-600 shadow hover:shadow-md transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-xl border border-orange-200/50">
                      <p className="text-[10px] font-medium text-gray-500">PRICE</p>
                      <p className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">LKR {product.price.toFixed(2)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-3 rounded-xl border border-pink-200/50">
                      <p className="text-[10px] font-medium text-gray-500">WEIGHT</p>
                      <p className="text-sm font-bold text-gray-800">{product.weight.value}{product.weight.unit}</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-xl border border-red-200/50">
                      <p className="text-[10px] font-medium text-gray-500">STOCK</p>
                      <p className="text-sm font-bold text-gray-800">{product.stockQuantity}</p>
                    </div>
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

// Orders Tab Component
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState({});
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
      const response = await axios.get('/seller/orders');
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/seller/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully!');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
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

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'processing',
      processing: 'shipped',
      shipped: 'delivered'
    };
    return statusFlow[currentStatus];
  };

  // CSV Export Function
  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    try {
      const csvData = filteredOrders.map(order => ({
        'Order Number': order.orderNumber,
        'Order Date': new Date(order.createdAt).toLocaleDateString(),
        'Customer Name': order.buyer?.name || 'N/A',
        'Customer Email': order.buyer?.email || 'N/A',
        'Status': order.status,
        'Total Amount': order.totalAmount,
        'Items Count': order.items.length,
        'Shipping Address': `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`,
        'Phone': order.shippingAddress.phone,
        'Products': order.items.map(item => `${item.product?.name} (Qty: ${item.quantity})`).join('; ')
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const fileName = `seller_orders_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, fileName);

      toast.success('CSV file exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV file');
    }
  };

  // PDF Export Function
  const exportToPDF = async () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    try {
      toast.loading('Generating PDF report...', { id: 'pdf-export' });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Professional Header
      pdf.setFillColor(255, 140, 0); // Orange color
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      // Company Name and Details
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CEYLON SPICES', 15, 15);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Premium Quality Spices from Sri Lanka', 15, 22);
      pdf.text('Established 1985 • ISO 22000 Certified', 15, 28);

      // Report Title
      yPosition = 50;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Seller Orders Report', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Company Details Section
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
      pdf.text('Company Information', 20, yPosition);
      
      // Company Details Content
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const companyDetails = [
        'Business Name: Ceylon Spices (Pvt) Ltd',
        'Registration: PV 123456789',
        'VAT Number: 123456789V',
        'Address: 123 Spice Garden Road, Colombo 07, Sri Lanka',
        'Phone: +94 11 234 5678',
        'Email: info@ceylonspices.lk',
        'Website: www.ceylonspices.lk'
      ];
      
      companyDetails.forEach((detail, index) => {
        pdf.text(detail, 20, yPosition + 8 + (index * 4));
      });
      
      yPosition += 50;

      // Enhanced Summary Section
      const totalOrders = filteredOrders.length;
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalItems = filteredOrders.reduce((sum, order) => sum + order.items.length, 0);
      const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
      const completedOrders = filteredOrders.filter(order => order.status === 'delivered').length;

      // Summary Box
      pdf.setFillColor(240, 248, 255);
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(15, yPosition - 5, pageWidth - 30, 35, 'FD');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 140, 0);
      pdf.text('Order Summary', 20, yPosition);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const summaryLeft = 20;
      const summaryRight = pageWidth / 2 + 10;
      
      pdf.text(`Total Orders: ${totalOrders}`, summaryLeft, yPosition + 8);
      pdf.text(`Total Revenue: LKR ${totalRevenue.toFixed(2)}`, summaryLeft, yPosition + 13);
      pdf.text(`Total Items Sold: ${totalItems}`, summaryLeft, yPosition + 18);
      pdf.text(`Pending Orders: ${pendingOrders}`, summaryRight, yPosition + 8);
      pdf.text(`Completed Orders: ${completedOrders}`, summaryRight, yPosition + 13);
      pdf.text(`Average Order Value: LKR ${(totalRevenue / totalOrders).toFixed(2)}`, summaryRight, yPosition + 18);
      
      yPosition += 45;

      // Orders Details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 140, 0);
      pdf.text('Order Details', 15, yPosition);
      yPosition += 10;

      filteredOrders.forEach((order, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        // Order Header
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Order #${order.orderNumber}`, 15, yPosition);
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 15, yPosition + 5);
        pdf.text(`Customer: ${order.buyer?.name} (${order.buyer?.email})`, 15, yPosition + 10);
        pdf.text(`Status: ${order.status.toUpperCase()}`, 15, yPosition + 15);
        pdf.text(`Total: LKR ${order.totalAmount.toFixed(2)}`, pageWidth - 50, yPosition);
        
        yPosition += 20;

        // Order Items
        pdf.setFontSize(9);
        order.items.forEach((item, itemIndex) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.text(`• ${item.product?.name}`, 20, yPosition);
          pdf.text(`  Qty: ${item.quantity} × LKR ${item.price.toFixed(2)} = LKR ${item.subtotal.toFixed(2)}`, 20, yPosition + 4);
          yPosition += 10;
        });

        // Shipping Address
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Shipping: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 20, yPosition);
        pdf.text(`Phone: ${order.shippingAddress.phone}`, 20, yPosition + 4);
        
        yPosition += 15;
        
        // Add separator line
        if (index < filteredOrders.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.5);
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
      pdf.text('This report was generated by Ceylon Spices Seller System', pageWidth / 2, footerY, { align: 'center' });
      
      // Right footer
      pdf.text('www.ceylonspices.lk', pageWidth - 15, footerY, { align: 'right' });
      pdf.text('info@ceylonspices.lk', pageWidth - 15, footerY + 3, { align: 'right' });
      pdf.text('+94 11 234 5678', pageWidth - 15, footerY + 6, { align: 'right' });

      // Add page numbers to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Save the PDF
      const fileName = `Ceylon_Spices_Seller_Orders_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success('Advanced PDF report generated successfully!', { id: 'pdf-export' });
    } catch (error) {
      toast.error('Failed to generate PDF report');
      console.error('PDF generation error:', error);
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
    <div className="space-y-10">
      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[{
          label: 'Total Orders', value: stats.totalOrders || 0, icon: <ShoppingBag className='w-7 h-7' />, colors: 'from-orange-500 to-red-500'
        },{
          label: 'Total Revenue', value: `LKR ${(stats.totalRevenue||0).toFixed(2)}`, icon: <DollarSign className='w-7 h-7' />, colors: 'from-green-500 to-emerald-500'
        },{
          label: 'Pending Orders', value: stats.pendingOrders || 0, icon: <Package className='w-7 h-7' />, colors: 'from-yellow-500 to-amber-500'
        },{
          label: 'Completed', value: stats.completedOrders || 0, icon: <TrendingUp className='w-7 h-7' />, colors: 'from-blue-500 to-cyan-500'
        }].map((c,i)=>(
          <div key={i} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-orange-200/40 shadow-xl p-6 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.colors} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full blur-2xl`}></div>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${c.colors} text-white shadow-lg ring-1 ring-white/20`}>{c.icon}</div>
                <div className="text-right">
                  <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">{c.label}</p>
                  <p className={`mt-1 text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${c.colors} bg-clip-text text-transparent drop-shadow`}>{c.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative flex justify-between items-center bg-white/80 backdrop-blur-xl border border-orange-200/30 rounded-3xl shadow-2xl px-8 py-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Received Orders</h2>
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

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="relative text-center py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-12">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-14 h-14 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h3>
            <p className="text-gray-600 mb-2">Orders from buyers will appear here</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="relative text-center py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-3xl blur-xl opacity-60" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-12">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-14 h-14 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders found</h3>
            <p className="text-gray-600 mb-2">No orders match your search criteria</p>
            <p className="text-sm text-gray-500">Try searching with a different Order ID</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order._id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-300/40 via-red-300/40 to-pink-300/40 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/30 overflow-hidden">
                <div className="p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Customer: {order.buyer?.name} ({order.buyer?.email})</p>
                    </div>
                    <div className="text-left md:text-right space-y-2">
                      <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase()+order.status.slice(1)}</span>
                        {getNextStatus(order.status) && (
                          <button onClick={() => handleUpdateOrderStatus(order._id, getNextStatus(order.status))} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow hover:shadow-md transition-all">
                            Mark as {getNextStatus(order.status)}
                          </button>
                        )}
                      </div>
                      <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">LKR {order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item,i)=>(
                      <div key={i} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shadow">
                          {item.product?.images?.[0] ? (
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-8 h-8 text-orange-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base">{item.product?.name}</h4>
                          <p className="text-xs md:text-sm text-gray-600">Qty: {item.quantity} × LKR {item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">LKR {item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-4 pt-6">
                    <div className="absolute inset-0 -top-2 bg-gradient-to-r from-orange-100/40 to-red-100/40 rounded-2xl blur opacity-60"></div>
                    <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/40 shadow">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center"><span className="text-red-500 mr-2">📦</span>Shipping Address</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                      <p className="text-sm text-gray-700 mt-1">Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Floating Action Buttons for Export */}
          <div className="fixed bottom-8 right-8 flex flex-col space-y-4 z-50">
            {/* CSV Export Button */}
            <button
              onClick={exportToCSV}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110"
              title="Export to CSV"
            >
              <Download className="w-6 h-6" />
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Export CSV
              </div>
            </button>

            {/* PDF Export Button */}
            <button
              onClick={exportToPDF}
              className="group relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110"
              title="Export to PDF"
            >
              <FileText className="w-6 h-6" />
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Export PDF
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Tab Component (same as buyer but for seller)
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
  // Validation state
  const [errors, setErrors] = useState({ name: '', phone: '' });

  const validateName = (value) => {
    if (!value.trim()) return 'Name is required';
    if (!/^[A-Za-z\s]+$/.test(value)) return 'Only letters and spaces allowed';
    return '';
  };
  const validatePhone = (value) => {
    if (!value) return ''; // optional
    if (!/^\d{10}$/.test(value)) return 'Phone must be 10 digits';
    return '';
  };
  const isFormValid = () => !errors.name && !errors.phone && profileData.name.trim() && (!profileData.phone || profileData.phone.length === 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateName(profileData.name);
    const phoneErr = validatePhone(profileData.phone);
    setErrors({ name: nameErr, phone: phoneErr });
    if (nameErr || phoneErr) return;
    const result = await updateProfile(profileData);
    if (result.success) setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-red-50/50 to-pink-100/50 rounded-3xl blur-xl opacity-60"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/30 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Profile</h2>
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
                isEditing ? 'bg-white/80 backdrop-blur-sm hover:bg-gray-50 text-gray-700 hover:text-orange-600 border-2 border-gray-200 hover:border-orange-300' : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Card */}
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
                        onBlur={() => setErrors(prev => ({ ...prev, name: validateName(profileData.name) }))
                        }
                        className={`relative w-full px-4 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-2xl text-gray-700 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-orange-100 ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-orange-200/40 focus:border-orange-400'}`}
                        required
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
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
                      {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
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
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))
                      }
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
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))
                        }
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
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, postalCode: e.target.value } }))
                        }
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
                    className={`font-semibold py-3 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${isFormValid() ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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
                <div className="bg-gradient-to-r from-red-50/50 to-pink-50/50 rounded-2xl p-6 border border-red-200/30">
                  <div className="flex items-center mb-4">
                    <span className="text-red-500 mr-2 text-lg">🏠</span>
                    <label className="text-lg font-semibold text-gray-700">Address</label>
                  </div>
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {user?.address ? (`${user.address.street}, ${user.address.city}, ${user.address.postalCode}, ${user.address.country}`) : ('Not provided')}
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

// Main Seller Dashboard Component
const SellerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    if (path && ['products', 'orders', 'profile'].includes(path)) {
      setActiveTab(path);
    } else {
      navigate('/seller/products', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated spice-themed background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-24 left-24 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-70 animate-bounce" style={{animationDuration: '3.5s'}} />
        <div className="absolute top-1/3 right-32 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s', animationDuration: '4.2s'}} />
        <div className="absolute bottom-44 left-1/3 w-5 h-5 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}} />
        <div className="absolute bottom-56 right-24 w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.2s'}} />
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<ProductsTab />} />
          <Route path="/products" element={<ProductsTab />} />
          <Route path="/orders" element={<OrdersTab />} />
          <Route path="/profile" element={<ProfileTab />} />
        </Routes>
      </main>
    </div>
  );
};

export default SellerDashboard;
