import { Link } from 'react-router-dom';
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  HeadphonesIcon,
  Globe,
  ArrowRight
} from 'lucide-react';

const ContactPage = () => {
  const contactInfo = [
    { icon: MapPin, title: 'Address', details: ['Ceylon Spices Trading Co.','123 Colombo Street','Colombo 00100, Sri Lanka'] },
    { icon: Phone, title: 'Phone', details: ['+94 11 234 5678','+94 77 123 4567'] },
    { icon: Mail, title: 'Email', details: ['info@ceylonspices.com','support@ceylonspices.com'] },
    { icon: Clock, title: 'Business Hours', details: ['Mon - Fri: 9:00 AM - 6:00 PM','Saturday: 9:00 AM - 2:00 PM','Sunday: Closed'] }
  ];

  const supportChannels = [
    { icon: MessageCircle, title: 'Live Chat', description: 'Get instant help from our support team', action: 'Start Chat' },
    { icon: HeadphonesIcon, title: 'Phone Support', description: 'Speak directly with our experts', action: 'Call Now' },
    { icon: Mail, title: 'Email Support', description: 'Detailed support via email', action: 'Send Email' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-red-100/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      {/* Floating Spice Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-24 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-70 animate-bounce" style={{animationDelay:'0s',animationDuration:'3s'}} />
        <div className="absolute top-52 right-36 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{animationDelay:'1s',animationDuration:'4s'}} />
        <div className="absolute bottom-52 left-48 w-5 h-5 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{animationDelay:'2s',animationDuration:'5s'}} />
        <div className="absolute bottom-72 right-24 w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-80 animate-bounce" style={{animationDelay:'0.5s',animationDuration:'3.5s'}} />
      </div>

      {/* Header */}
      <header className="backdrop-blur-xl sticky top-0 z-50 bg-white/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                <div className="text-2xl group-hover:animate-pulse">🌶️</div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Ceylon Spices</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-orange-600 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">About</Link>
              <span className="text-orange-600 font-semibold px-4 py-2 rounded-xl bg-orange-50">Contact</span>
            </nav>
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login" className="text-gray-700 hover:text-orange-600 font-semibold px-6 py-2.5 rounded-2xl hover:bg-orange-50 transition-all duration-300 hover:scale-105">Login</Link>
              <Link to="/register" className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold px-6 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg">Register</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 text-center">
        <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6">
          <Globe className="w-5 h-5 text-orange-600 mr-2" />
          <span className="text-sm font-semibold text-gray-700">We are here to help</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Get In Touch</span>
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">Questions, feedback, or partnership ideas? 🌶️ Our team is ready to assist you with anything related to authentic Sri Lankan spices.</p>
      </section>

      {/* Support Channels */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {supportChannels.map((channel, index) => (
              <div key={index} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-200/30 hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:bg-white/90 text-center">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 group-hover:from-orange-200 group-hover:via-red-200 group-hover:to-pink-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 shadow-lg group-hover:shadow-xl">
                      <channel.icon className="w-10 h-10 text-orange-600 group-hover:text-red-600 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-800 transition-colors duration-300">{channel.title}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4">{channel.description}</p>
                  <button className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center">
                    {channel.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Info & Map */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mr-4">
                      <info.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">Visit Us</h2>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group h-80">
                <img src="https://images.unsplash.com/photo-1594307786475-0b04e3e6d5b1?w=900&h=600&fit=crop" alt="Office" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg text-sm font-semibold text-gray-700 flex items-center">📍 Colombo, Sri Lanka</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-orange-200/40 rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Reach Out?</h3>
                <ul className="space-y-3 text-gray-600">
                  {['Wholesale inquiries','Product authenticity checks','Order & shipping support','Partnership & media','Feedback & improvements'].map((item,i)=>(
                    <li key={i} className="flex items-center"><span className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/40 to-red-50/50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6">
              <Globe className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-bold text-orange-800">Quick Answers</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">Everything you need to know about shipping, freshness, authenticity, and support.</p>
          </div>
          <div className="space-y-6">
            {[
              {question: 'How long does shipping take?', answer: 'Worldwide delivery: 3-7 business days (express) or 7-14 business days (standard), depending on destination.'},
              {question: 'Are your spices organic and authentic?', answer: 'Yes. We source directly from certified Sri Lankan farmers. Many products are organic certified; all are purity tested.'},
              {question: 'What is your return policy?', answer: '30-day satisfaction guarantee. Contact support for a full refund or exchange if you are not satisfied.'},
              {question: 'Do you offer bulk purchasing for businesses?', answer: 'Yes. Restaurants, retailers, and distributors can request wholesale quotes with tiered pricing.'},
              {question: 'How do you ensure spice freshness during shipping?', answer: 'Vacuum-sealed, batch-coded packaging; shipped within 48 hours of processing to lock in aroma & potency.'}
            ].map((faq,i)=>(
              <details key={i} className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="ml-4 text-orange-500 group-open:rotate-90 transition-transform">➤</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-6 group">
                <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                  <div className="text-3xl group-hover:animate-pulse">🌶️</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                  <li key={i} className="flex items-center group"><span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-125 transition-transform" />{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-red-400">🏢 Company</h3>
              <ul className="space-y-3 text-gray-300">
                {['About Us','Our Story','Careers','Contact'].map((item,i)=>(
                  <li key={i} className="flex items-center group"><span className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:scale-125 transition-transform" />{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-pink-400">🛟 Support</h3>
              <ul className="space-y-3 text-gray-300">
                {['Help Center','Shipping Info','Returns','Track Order'].map((item,i)=>(
                  <li key={i} className="flex items-center group"><span className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:scale-125 transition-transform" />{item}</li>
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

export default ContactPage;
