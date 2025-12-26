import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart: addItemToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const products = await productAPI.search({ product_id: parseInt(id) });
      if (products && products.length > 0) {
        setProduct(products[0]);
      }
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error('Not enough stock available');
      return;
    }

    addItemToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`);
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

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/products')}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl p-12 flex items-center justify-center">
          <Package className="h-48 w-48 text-primary-600" />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-primary-600 mb-6">
            ${parseFloat(product.price).toFixed(2)}
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-primary-300 bg-white text-primary-600 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-all duration-200 font-semibold active:scale-95"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center input-field font-semibold"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border-2 border-primary-300 bg-white text-primary-600 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-all duration-200 font-semibold active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

