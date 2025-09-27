import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User, Store, Mail, Lock, Phone, ArrowRight, Sparkles, ShoppingBag, Home } from 'lucide-react';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'buyer'
    }
  });

  const watchRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    await registerUser(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90 text-gray-700 hover:text-orange-600 p-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
      >
        <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </Link>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-red-100/20 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Floating spice particles */}
        <div className="absolute top-24 left-24 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-70 animate-bounce" style={{animationDelay:'0s',animationDuration:'3s'}} />
        <div className="absolute top-52 right-36 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{animationDelay:'1s',animationDuration:'4s'}} />
        <div className="absolute bottom-52 left-48 w-5 h-5 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{animationDelay:'2s',animationDuration:'5s'}} />
        <div className="absolute bottom-72 right-24 w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-80 animate-bounce" style={{animationDelay:'0.5s',animationDuration:'3.5s'}} />
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-4 rounded-2xl shadow-2xl transform -rotate-3 hover:-rotate-6 transition-transform duration-300 relative overflow-hidden">
                <div className="text-4xl">🌶️</div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Join Ceylon Spices
          </h1>
          <p className="text-lg text-gray-600 font-medium">Start your aromatic journey today</p>
        </div>

        {/* Registration Form */}
        <form className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 space-y-6 hover:shadow-3xl transition-all duration-500" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Choose your role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                watchRole === 'buyer' 
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg' 
                  : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md'
              }`}>
                <div className={`p-3 rounded-full mb-3 transition-colors ${
                  watchRole === 'buyer' ? 'bg-orange-500' : 'bg-gray-400'
                }`}>
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 mb-1">Buyer</div>
                  <div className="text-xs text-gray-600">Discover & purchase premium spices</div>
                </div>
                <input
                  type="radio"
                  value="buyer"
                  className="absolute top-3 right-3 w-4 h-4 text-orange-600"
                  {...register('role', { required: 'Please select a role' })}
                />
                {watchRole === 'buyer' && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-orange-500 animate-pulse" />
                )}
              </label>

              <label className={`relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                watchRole === 'seller' 
                  ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg' 
                  : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md'
              }`}>
                <div className={`p-3 rounded-full mb-3 transition-colors ${
                  watchRole === 'seller' ? 'bg-pink-500' : 'bg-gray-400'
                }`}>
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 mb-1">Seller</div>
                  <div className="text-xs text-gray-600">Sell authentic Sri Lankan spices</div>
                </div>
                <input
                  type="radio"
                  value="seller"
                  className="absolute top-3 right-3 w-4 h-4 text-pink-600"
                  {...register('role', { required: 'Please select a role' })}
                />
                {watchRole === 'seller' && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-pink-500 animate-pulse" />
                )}
              </label>
            </div>
            {errors.role && (
              <p className="text-sm text-red-500 flex items-center mt-2">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                id="name"
                className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-lg ${errors.name ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Enter your full name (letters only)"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  pattern: { value: /^[A-Za-z\s]+$/, message: 'Name can only contain letters and spaces' }
                })}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
            <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="email"
                id="email"
                className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-lg ${errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Enter your email address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="tel"
                id="phone"
                className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-lg ${errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Enter 10-digit phone number"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: /^\d{10}$/, message: 'Phone number must be exactly 10 digits' },
                  minLength: { value: 10, message: 'Phone number must be exactly 10 digits' },
                  maxLength: { value: 10, message: 'Phone number must be exactly 10 digits' }
                })}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                className={`w-full px-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-lg ${errors['address.city'] ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Your city"
                {...register('address.city', { required: 'City is required' })}
              />
              {errors['address.city'] && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                  {errors['address.city'].message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                className={`w-full px-4 py-3.5 border-2 rounded-2xl bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-lg ${errors['address.postalCode'] ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Postal code (numbers only)"
                {...register('address.postalCode', {
                  required: 'Postal code is required',
                  pattern: { value: /^\d+$/, message: 'Postal code can only contain numbers' }
                })}
              />
              {errors['address.postalCode'] && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                  {errors['address.postalCode'].message}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`w-full pl-10 pr-12 py-3.5 border-2 rounded-2xl bg-gray-50/50 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:shadow-lg ${errors.password ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                placeholder="Create a strong password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                Creating your account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-orange-600 hover:text-orange-700 font-bold hover:underline transition-colors inline-flex items-center"
              >
                Sign in here
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
