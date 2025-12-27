import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle, ArrowLeft, Wallet, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderAPI.getById(parseInt(orderId));
      setOrder(data);
      const total = typeof data['Total Price'] === 'number' ? data['Total Price'] : parseFloat(data['Total Price']);
      setPaidAmount(total.toFixed(2));
    } catch (error) {
      console.error('Load order error:', error);
      toast.error(error.response?.data?.message || 'Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to process payment');
      navigate('/login');
      return;
    }

    setPaying(true);

    try {
      const paymentData = {
        order_id: parseInt(orderId),
        paid_amount: parseFloat(paidAmount),
        payment_method: paymentMethod
      };

      console.log('Sending payment:', paymentData);
      const response = await orderAPI.pay(paymentData);
      console.log('Payment response:', response);
      
      toast.success(`Payment successful via ${paymentMethod.toUpperCase()}!`);
      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error('Payment error:', error);
      
      // Handle network errors
      if (!error.response) {
        toast.error('Network error. Please check your connection and try again.');
        return;
      }
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.detail || 
        error.message || 
        'Payment failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const total = typeof order['Total Price'] === 'number' 
    ? order['Total Price'] 
    : parseFloat(order['Total Price']);
  const paidAmountNum = parseFloat(paidAmount) || 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(`/orders/${orderId}`)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Order</span>
      </button>

      <div className="card">
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Payment</h1>
          <p className="text-sm sm:text-base text-gray-600">Order #{order.order_id}</p>
        </div>

        {!user && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please <button onClick={() => navigate('/login')} className="font-semibold underline">login</button> to process payment
            </p>
          </div>
        )}

        <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600 font-medium">Total Amount</span>
            <span className="text-2xl sm:text-3xl font-bold text-primary-600">
              Kyats {total.toFixed(2)}
            </span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  paymentMethod === 'cash'
                    ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 shadow-md'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                }`}
              >
                <Wallet className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 transition-colors ${
                  paymentMethod === 'cash' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs sm:text-sm font-semibold transition-colors ${
                  paymentMethod === 'cash' ? 'text-primary-700' : 'text-gray-600'
                }`}>
                  Cash
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('kbz')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  paymentMethod === 'kbz'
                    ? 'border-secondary-600 bg-gradient-to-br from-secondary-50 to-secondary-100 shadow-md'
                    : 'border-gray-300 hover:border-secondary-400 hover:bg-secondary-50'
                }`}
              >
                <Building2 className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 transition-colors ${
                  paymentMethod === 'kbz' ? 'text-secondary-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs sm:text-sm font-semibold transition-colors ${
                  paymentMethod === 'kbz' ? 'text-secondary-700' : 'text-gray-600'
                }`}>
                  KBZ
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('aya')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  paymentMethod === 'aya'
                    ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-secondary-50 shadow-md'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                }`}
              >
                <Building2 className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 transition-colors ${
                  paymentMethod === 'aya' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs sm:text-sm font-semibold transition-colors ${
                  paymentMethod === 'aya' ? 'text-primary-700' : 'text-gray-600'
                }`}>
                  AYA
                </span>
              </button>
            </div>
          </div>

          {/* Payment Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount
            </label>
            <input
              type="number"
              step="0.01"
              required
              min={total}
              className="input-field"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              placeholder="Enter payment amount"
            />
            <p className="mt-1 text-sm text-gray-500 font-medium">
              Minimum amount: Kyats {total.toFixed(2)}
              {paidAmountNum > total && (
                <span className="text-green-600 ml-2 font-semibold">
                  Change: Kyats {(paidAmountNum - total).toFixed(2)}
                </span>
              )}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Payment Method:</strong> {paymentMethod.toUpperCase()}
              {paymentMethod !== 'cash' && ' (Bank transfer)'}
            </p>
          </div>

          <button
            type="submit"
            disabled={paying || paidAmountNum < total || !user}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Complete Payment</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;

