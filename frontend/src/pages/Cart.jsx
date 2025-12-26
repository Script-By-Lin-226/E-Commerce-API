import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  const createOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast.error('Please login to create an order');
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };

      const response = await orderAPI.create(orderData);
      console.log('Order response:', response);
      
      // Handle different response formats
      const orderId = response['Order ID'] || response.order_id || response.id;
      
      if (!orderId) {
        throw new Error('Order ID not found in response');
      }

      clearCart();
      toast.success('Order created successfully!');
      navigate(`/payment/${orderId}`);
    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.detail || 
        error.message || 
        'Failed to create order. Please try again.';
      toast.error(errorMessage);
    }
  };

  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product_id} className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4 flex-1 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl font-bold text-primary-600">{item.product.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold truncate">{item.product.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">${parseFloat(item.product.price).toFixed(2)} each</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 rounded-lg border-2 border-primary-300 bg-white text-primary-600 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-all duration-200 font-semibold active:scale-95"
                  >
                    −
                  </button>
                  <span className="w-10 sm:w-12 text-center font-semibold text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg border-2 border-primary-300 bg-white text-primary-600 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-all duration-200 font-semibold active:scale-95"
                  >
                    +
                  </button>
                </div>
                <span className="text-base sm:text-lg font-semibold text-right min-w-[80px]">
                  ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => handleRemoveFromCart(item.product_id)}
                  className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-red-600 active:scale-95"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card lg:sticky lg:top-24">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
            {!user && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Please <button onClick={() => navigate('/login')} className="font-semibold underline">login</button> to create an order
                </p>
              </div>
            )}
            <button
              onClick={createOrder}
              disabled={!user}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

