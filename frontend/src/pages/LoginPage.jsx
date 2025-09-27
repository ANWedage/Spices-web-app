import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Home } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    await login(data.email, data.password);
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

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-orange-100/20 to-red-100/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-4 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300 relative overflow-hidden">
                <div className="text-4xl">🌶️</div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600 font-medium">Sign in to continue your spice journey</p>
        </div>

        <form className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 space-y-6 hover:shadow-3xl transition-all duration-500" onSubmit={handleSubmit(onSubmit)}>
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
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                {errors.email.message}
              </p>
            )}
          </div>

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
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
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

          

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                Signing you in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              New to Ceylon Spices?{' '}
              <Link 
                to="/register" 
                className="text-orange-600 hover:text-orange-700 font-bold hover:underline transition-colors inline-flex items-center"
              >
                Create an account
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
