import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  Globe,
  Heart,
  Leaf,
  Shield,
  Target,
  CheckCircle
} from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Shield,
      title: 'Authenticity',
      description: 'We guarantee 100% authentic Sri Lankan spices sourced directly from trusted farmers and suppliers.'
    },
    {
      icon: Heart,
      title: 'Quality',
      description: 'Every spice is carefully selected, tested, and packaged to maintain the highest quality standards.'
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We support sustainable farming practices and fair trade to protect our environment and communities.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Bringing the authentic taste of Sri Lanka to spice lovers around the world with reliable shipping.'
    }
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'Started as a small family business with a passion for authentic Sri Lankan spices.'
    },
    {
      year: '2015',
      title: 'International Expansion',
      description: 'Began shipping worldwide, bringing Ceylon spices to global markets.'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched our online platform to better serve customers worldwide.'
    },
    {
      year: '2025',
      title: 'Trusted Leader',
      description: 'Now serving thousands of customers globally with premium Sri Lankan spices.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 scroll-smooth relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-red-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      {/* Floating Spice Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-24 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-70 animate-bounce" style={{animationDelay:'0s',animationDuration:'3s'}}></div>
        <div className="absolute top-52 right-36 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{animationDelay:'1s',animationDuration:'4s'}}></div>
        <div className="absolute bottom-52 left-48 w-5 h-5 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{animationDelay:'2s',animationDuration:'5s'}}></div>
        <div className="absolute bottom-72 right-24 w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-80 animate-bounce" style={{animationDelay:'0.5s',animationDuration:'3.5s'}}></div>
      </div>

      {/* Header (same style as HomePage) */}
      <header className="backdrop-blur-xl sticky top-0 z-50 bg-white/60 shadow-lg transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                <div className="text-2xl group-hover:animate-pulse">🌶️</div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Ceylon Spices</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">Home</Link>
              <span className="text-orange-600 font-semibold px-4 py-2 rounded-xl bg-orange-50">About</span>
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">Contact</Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login" className="text-gray-700 hover:text-orange-600 font-semibold px-6 py-2.5 rounded-2xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">Login</Link>
              <Link to="/register" className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold px-6 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg">Register</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6">
            <Award className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-sm font-semibold text-gray-700">15+ Years of Authentic Flavor</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Our Journey</span>
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">In Every Spice</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            🌶️ From humble beginnings in the spice gardens of Sri Lanka to a global community of flavor enthusiasts — we craft authenticity, sustainability, and excellence into every grain.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-red-50/30 to-pink-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed">Ceylon Spices was born from a deep love for the rich culinary heritage of Sri Lanka. Our founder grew up surrounded by the aromatic spice gardens of Kandy — a legacy we preserve.</p>
              <p className="text-lg text-gray-700 leading-relaxed">We built direct relationships with smallholder farmers to ensure fair trade, sustainable cultivation, and unmatched freshness. Every batch is hand-selected and quality verified.</p>
              <p className="text-lg text-gray-700 leading-relaxed">Today, we empower communities while delivering vibrant, authentic flavors to kitchens worldwide. Every jar tells a story of tradition, purity, and passion.</p>
              <div className="flex items-center space-x-6 pt-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-orange-200/40">
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">50+</p>
                  <p className="text-sm text-gray-600">Partner Farms</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-orange-200/40">
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">100%</p>
                  <p className="text-sm text-gray-600">Authentic Origin</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-orange-200/40">
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">15+</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                <img src="https://images.unsplash.com/photo-1596392943537-24bbbef27070?w=900&h=700&fit=crop" alt="Sri Lankan spice farm" className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-orange-200/50">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">5000+</p>
                  <p className="text-sm text-gray-600">Happy Customers</p>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-orange-500 to-red-500 text-white p-5 rounded-2xl shadow-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-xs opacity-90">Organic Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/40 to-red-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6">
              <Globe className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-bold text-orange-800">What Drives Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Our Core Values</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">Guiding principles that shape our sourcing, quality standards, and commitment to people & planet.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-200/30 hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:bg-white/90 text-center">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 group-hover:from-orange-200 group-hover:via-red-200 group-hover:to-pink-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 shadow-lg group-hover:shadow-xl">
                      <value.icon className="w-10 h-10 text-orange-600 group-hover:text-red-600 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-800 transition-colors duration-300">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{value.description}</p>
                  <div className="mt-6 w-full bg-orange-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out group-hover:to-pink-500" style={{width: `${85 + index * 5}%`}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">Our Journey</h2>
            <p className="text-lg text-gray-700">Milestones that shaped who we are today</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-200 via-red-200 to-pink-200"></div>
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}> 
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-10 text-right' : 'pl-10'}`}> 
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-orange-200/40 hover:shadow-2xl transition-all">
                      <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-4 border-white shadow-xl"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 via-transparent to-purple-500/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 text-4xl animate-bounce" style={{animationDelay:'0s',animationDuration:'3s'}}>🌶️</div>
          <div className="absolute top-40 right-1/4 text-3xl animate-bounce" style={{animationDelay:'1s',animationDuration:'4s'}}>⭐</div>
          <div className="absolute bottom-32 left-1/3 text-4xl animate-bounce" style={{animationDelay:'2s',animationDuration:'3.5s'}}>🌿</div>
          <div className="absolute bottom-40 right-1/3 text-3xl animate-bounce" style={{animationDelay:'0.5s',animationDuration:'4.5s'}}>🥄</div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Target className="w-20 h-20 text-white mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Our Mission</h2>
          <p className="text-xl text-white/90 leading-relaxed mb-10 max-w-3xl mx-auto">To preserve and share the authentic flavors of Sri Lankan spices while uplifting farming communities and promoting sustainable agricultural practices. Great spices connect cultures and create memories.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {['Authentic Quality','Fair Trade','Global Delivery'].map((item,i)=>(
              <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 text-white font-semibold shadow-lg border border-white/20">{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (same as HomePage) */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6 group">
                <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                  <div className="text-3xl group-hover:animate-pulse">🌶️</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Ceylon Spices</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">🌶️ Bringing you the finest authentic Sri Lankan spices directly from trusted farmers and suppliers. Experience the true taste of Ceylon.</p>
              <div className="flex space-x-4">
                <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 cursor-pointer">❤️</div>
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 cursor-pointer">🌿</div>
                <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl hover:from-yellow-500/30 hover:to-yellow-600/30 transition-all duration-300 cursor-pointer">✨</div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-orange-400">🌿 Products</h3>
              <ul className="space-y-3 text-gray-300">
                {['Whole Spices','Ground Spices','Spice Blends','Herbs'].map((item,i)=>(
                  <li key={i} className="flex items-center group">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-red-400">🏢 Company</h3>
              <ul className="space-y-3 text-gray-300">
                {['About Us','Our Story','Careers','Contact'].map((item,i)=>(
                  <li key={i} className="flex items-center group">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-pink-400">🛟 Support</h3>
              <ul className="space-y-3 text-gray-300">
                {['Help Center','Shipping Info','Returns','Track Order'].map((item,i)=>(
                  <li key={i} className="flex items-center group">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">&copy; 2025 Ceylon Spices. All rights reserved. Made with ❤️ for spice lovers worldwide.</p>
            <div className="flex space-x-4">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 px-4 py-2 rounded-full"><span className="text-sm font-semibold text-green-400">✅ 100% Organic</span></div>
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-4 py-2 rounded-full"><span className="text-sm font-semibold text-blue-400">🚚 Free Shipping</span></div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 px-4 py-2 rounded-full"><span className="text-sm font-semibold text-yellow-400">⭐ Premium Quality</span></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
