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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
      <button
        onClick={() => navigate('/products')}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-4 sm:mb-6 text-sm sm:text-base"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Back to Products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {product.image_url ? (
          <div className="rounded-xl overflow-hidden order-1">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-auto sm:h-[400px] lg:h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          </div>
        ) : null}
        <div className={`bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl p-8 sm:p-12 flex items-center justify-center order-1 ${product.image_url ? 'hidden' : ''}`}>
          <Package className="h-32 w-32 sm:h-48 sm:w-48 text-primary-600" />
        </div>

        <div className="order-2 flex flex-col">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 break-words">{product.name}</h1>
          <p className="text-xl sm:text-2xl font-bold text-primary-600 mb-4 sm:mb-6">
            Kyats {parseFloat(product.price).toFixed(2)}
          </p>
          <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{product.description}</p>

          <div className="mb-4 sm:mb-6">
            <span
              className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                !product.is_active
                  ? 'bg-gray-200 text-gray-800'
                  : product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {!product.is_active
                ? 'Product is not available'
                : product.stock > 0
                ? `In Stock (${product.stock} available)`
                : 'Out of Stock'}
            </span>
          </div>

          {(product.stock > 0 || product.is_active === true) && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 border-primary-300 bg-white text-primary-600 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-all duration-200 font-semibold active:scale-95 text-lg sm:text-xl"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-16 sm:w-20 text-center input-field font-semibold text-sm sm:text-base"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 border-primary-300 bg-white text-primary-600 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-all duration-200 font-semibold active:scale-95 text-lg sm:text-xl"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || product.is_active === false}
            className="btn-primary w-full sm:w-auto sm:min-w-[200px] flex items-center justify-center space-x-2 py-3 sm:py-3 text-sm sm:text-base mt-auto"
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{product.is_active > 0 ? 'Add to Cart' : 'Unavailable'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

