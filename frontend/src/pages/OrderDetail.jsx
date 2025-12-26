import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { ArrowLeft, Package, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderAPI.getById(parseInt(id));
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/orders"
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Orders</span>
      </Link>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order #{order.order_id}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-3xl font-bold text-primary-600">
              ${order['Total Price'].toFixed(2)}
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${parseFloat(item.Total_price).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.status !== 'paid' && (
          <div className="mt-6 pt-6 border-t">
            <Link
              to={`/payment/${order.order_id}`}
              className="btn-primary inline-block"
            >
              Pay Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;

