import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, User, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalQuantity } = useCart();
  const navigate = useNavigate();
  const cartCount = getTotalQuantity();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                E-Commerce
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
                Products
              </Link>
              {user && (
                <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition-colors">
                  My Orders
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link to="/admin/products" className="text-gray-700 hover:text-primary-600 transition-colors hidden md:block">
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

