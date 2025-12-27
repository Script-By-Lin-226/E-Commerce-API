import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, User, LogOut, Home, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalQuantity } = useCart();
  const navigate = useNavigate();
  const cartCount = getTotalQuantity();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
      setIsSidebarOpen(false);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 md:space-x-8">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link to="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
                <Package className="h-8 w-8 text-primary-600" />
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  E-Commerce
                </span>
              </Link>
              
              {/* Desktop Navigation */}
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

            {/* Desktop Right Side */}
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
                <div className="hidden md:flex items-center space-x-3">
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

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                E-Commerce
              </span>
            </div>
            <button
              onClick={closeSidebar}
              className="text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Link
                to="/"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                to="/products"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/orders"
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/admin/products"
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    <Package className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                </>
              )}

              <Link
                to="/cart"
                onClick={handleLinkClick}
                className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="bg-secondary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t space-y-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block w-full text-center btn-secondary text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="block w-full text-center btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

