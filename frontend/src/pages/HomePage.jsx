import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star,
  Users,
  Package,
  Shield,
  Truck,
  ArrowRight,
  CheckCircle,
  Globe,
  Award,
  Leaf,
  Heart,
  Menu,
  X
} from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Authentic Quality',
      description: 'Direct from Sri Lankan farmers and trusted suppliers with quality guarantee'
    },
    {
      icon: Globe,
      title: 'Global Shipping',
      description: 'Fresh spices delivered worldwide with secure packaging and tracking'
    },
    {
      icon: Award,
      title: 'Premium Grade',
      description: 'Hand-picked, premium grade spices that meet international standards'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support from spice experts to help with your needs'
    }
  ];



  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Home Chef',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b6932db7?w=80&h=80&fit=crop&crop=faces',
      content: 'The Ceylon cinnamon is absolutely incredible! The quality is unmatched and it has transformed my baking.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Restaurant Owner',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces',
      content: 'We\'ve been sourcing spices from Ceylon Spices for over a year. Consistent quality and fast delivery every time.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Food Blogger',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces',
      content: 'These authentic Sri Lankan spices have elevated my cooking to a whole new level. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 scroll-smooth relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-red-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Spice Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-40 left-40 w-5 h-5 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        <div className="absolute bottom-60 right-20 w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
      </div>

      {/* Header */}
      <header className={`backdrop-blur-xl sticky top-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 shadow-2xl border-b border-orange-200/50' : 'bg-white/60 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center group">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                <div className="text-2xl group-hover:animate-pulse">🌶️</div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Ceylon Spices</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <a href="#home" className="text-gray-700 hover:text-orange-600 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">Home</a>
              <Link to="/about" className="text-gray-700 hover:text-orange-600 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">Contact</Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                to="/login"
                className="text-gray-700 hover:text-orange-600 font-semibold px-6 py-2.5 rounded-2xl hover:bg-orange-50 transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold px-6 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-spice-600 font-medium">Home</a>
                <Link to="/about" className="text-gray-700 hover:text-spice-600 font-medium">About</Link>
                <Link to="/contact" className="text-gray-700 hover:text-spice-600 font-medium">Contact</Link>
                <div className="pt-4 flex flex-col space-y-2">
                  <Link 
                    to="/login"
                    className="text-center text-gray-700 hover:text-spice-600 font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="text-center bg-spice-500 hover:bg-spice-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-24 overflow-hidden">
        {/* Spice Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-8 h-8 bg-orange-400 rounded-full"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-red-400 rounded-full"></div>
          <div className="absolute bottom-40 left-40 w-10 h-10 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-60 right-20 w-4 h-4 bg-pink-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-amber-400 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-7 h-7 bg-orange-500 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6">
                <Leaf className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-gray-700">100% Organic & Authentic</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Authentic</span>
                <br />
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">Sri Lankan</span>
                <br />
                <span className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Spices</span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                🌶️ Experience the rich, exotic flavors of Ceylon with our premium collection of authentic Sri Lankan spices. 
                From aromatic Ceylon cinnamon to bold black pepper, bring the vibrant taste of paradise to your kitchen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center group"
                >
                  Start Your Spice Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-bold px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-500 mr-2" />
                  Quality Guaranteed
                </div>
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-blue-500 mr-2" />
                  Free Shipping
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-yellow-500 mr-2" />
                  Premium Grade
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Main Image with Enhanced Styling */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                <img 
                  src="https://images.unsplash.com/photo-1596040033229-a04017543815?w=700&h=500&fit=crop" 
                  alt="Sri Lankan Spices" 
                  className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-orange-200/50">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">100% Authentic</p>
                    <p className="text-sm text-gray-600">Certified organic spices</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold">5000+</p>
                  <p className="text-sm opacity-90">Happy Customers</p>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-10 -left-4 w-20 h-20 bg-gradient-to-br from-yellow-200/50 to-orange-200/50 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 right-10 w-16 h-16 bg-gradient-to-br from-red-200/50 to-pink-200/50 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-red-50/30 to-pink-50/50"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6">
              <Award className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-bold text-orange-800">Premium Quality Guaranteed</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Why Choose Ceylon Spices?
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              🌟 We connect you directly with Sri Lankan farmers and trusted suppliers to bring you the finest spices with guaranteed authenticity and exceptional quality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-200/30 hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:bg-white/90 text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 group-hover:from-orange-200 group-hover:via-red-200 group-hover:to-pink-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 shadow-lg group-hover:shadow-xl">
                      <feature.icon className="w-10 h-10 text-orange-600 group-hover:text-red-600 group-hover:scale-110 transition-all duration-300" />
                    </div>
                    {/* Decorative Ring */}
                    <div className="absolute -inset-2 border-2 border-orange-200/30 rounded-3xl group-hover:border-red-300/50 transition-colors duration-300"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-6 w-full bg-orange-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out group-hover:to-pink-500" 
                      style={{width: `${85 + index * 5}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Spice Showcase */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Premium Spice Collection</h3>
            <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
              {[
                { name: 'Ceylon Cinnamon', emoji: '🌿', color: 'from-amber-400 to-orange-500' },
                { name: 'Black Pepper', emoji: '⚫', color: 'from-gray-600 to-black' },
                { name: 'Cardamom', emoji: '🌱', color: 'from-green-400 to-emerald-500' },
                { name: 'Cloves', emoji: '🟤', color: 'from-amber-600 to-red-600' },
                { name: 'Nutmeg', emoji: '🥜', color: 'from-yellow-500 to-orange-600' }
              ].map((spice, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className={`text-3xl mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {spice.emoji}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{spice.name}</p>
                  <div className={`w-full h-1 bg-gradient-to-r ${spice.color} rounded-full mt-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-red-50/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-6">
              <Star className="w-5 h-5 text-yellow-600 mr-2 fill-current" />
              <span className="text-sm font-bold text-orange-800">5-Star Reviews</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                What Our Customers Say
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              ❤️ Join thousands of satisfied customers who trust Ceylon Spices for authentic flavors and exceptional quality
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-orange-200/30 hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:bg-white/95 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100/50 to-red-100/50 rounded-full -translate-y-8 translate-x-8"></div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center mb-6 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current hover:scale-110 transition-transform duration-200" />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-gray-600">({testimonial.rating}.0)</span>
                  </div>
                  
                  {/* Quote */}
                  <div className="relative mb-8">
                    <div className="text-6xl text-orange-200 absolute -top-4 -left-2 font-serif">"</div>
                    <p className="text-gray-700 text-lg leading-relaxed italic pl-8 relative z-10 group-hover:text-gray-800 transition-colors duration-300">
                      {testimonial.content}
                    </p>
                    <div className="text-6xl text-orange-200 absolute -bottom-8 -right-2 font-serif">"</div>
                  </div>
                  
                  {/* Customer Info */}
                  <div className="flex items-center relative z-10">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-4 ring-orange-100 group-hover:ring-orange-200 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-900 text-lg group-hover:text-orange-800 transition-colors duration-300">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600 font-medium bg-orange-50 px-3 py-1 rounded-full inline-block mt-1">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Border */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-transparent to-purple-500/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Spice Icons */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 text-4xl animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>🌶️</div>
          <div className="absolute top-40 right-1/4 text-3xl animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>⭐</div>
          <div className="absolute bottom-32 left-1/3 text-4xl animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>🌿</div>
          <div className="absolute bottom-40 right-1/3 text-3xl animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4.5s'}}>🥄</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Heart className="w-5 h-5 text-white mr-2 animate-pulse" />
              <span className="text-sm font-bold text-white">Join 5000+ Happy Customers</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Experience
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                Authentic Flavors?
              </span>
            </h2>
            
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              🚀 Join our community of spice enthusiasts and discover the authentic taste of Sri Lanka. 
              Transform your cooking with premium Ceylon spices - Start your culinary adventure today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-orange-600 hover:bg-gray-50 font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center group text-lg"
              >
                🎯 Create Account
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm text-lg"
              >
                👋 Sign In
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 grid md:grid-cols-3 gap-8 text-white/80">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">5000+</div>
                <p className="text-sm">Happy Customers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <p className="text-sm">Authentic Spices</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <p className="text-sm">Expert Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6 group">
                <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                  <div className="text-3xl group-hover:animate-pulse">🌶️</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Ceylon Spices
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                🌶️ Bringing you the finest authentic Sri Lankan spices directly from trusted farmers and suppliers. 
                Experience the true taste of Ceylon.
              </p>
              <div className="flex space-x-4">
                <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 cursor-pointer">
                  <Heart className="w-6 h-6 text-red-400 hover:scale-110 transition-transform" />
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 cursor-pointer">
                  <Leaf className="w-6 h-6 text-green-400 hover:scale-110 transition-transform" />
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 cursor-pointer">
                  <Globe className="w-6 h-6 text-blue-400 hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-orange-400">🌿 Products</h3>
              <ul className="space-y-3">
                {['Whole Spices', 'Ground Spices', 'Spice Blends', 'Herbs'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-red-400">🏢 Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Our Story', 'Careers', 'Contact'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-pink-400">🛟 Support</h3>
              <ul className="space-y-3">
                {['Help Center', 'Shipping Info', 'Returns', 'Track Order'].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-700/50 mt-16 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
                &copy; 2025 Ceylon Spices. All rights reserved. Made with ❤️ for spice lovers worldwide.
              </p>
              
              {/* Quality Badges */}
              <div className="flex space-x-4">
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-green-400">✅ 100% Organic</span>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-blue-400">🚚 Free Shipping</span>
                </div>
                <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold text-yellow-400">⭐ Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
