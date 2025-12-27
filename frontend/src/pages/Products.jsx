import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { Search, ShoppingCart, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Products loading error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to load products';
      toast.error(errorMessage);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.name) params.name = searchParams.name;
      if (searchParams.description) params.description = searchParams.description;
      if (searchParams.price) params.price = parseInt(searchParams.price);
      if (searchParams.stock) params.stock = parseInt(searchParams.stock);

      const data = await productAPI.search(params);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Search failed';
      toast.error(errorMessage);
      setProducts([]); // Set empty array on error
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Products
        </h1>

        {/* Search Section */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="input-field"
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Search by description..."
              className="input-field"
              value={searchParams.description}
              onChange={(e) => setSearchParams({ ...searchParams, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max price..."
              className="input-field"
              value={searchParams.price}
              onChange={(e) => setSearchParams({ ...searchParams, price: e.target.value })}
            />
            <button onClick={handleSearch} className="btn-primary flex items-center justify-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
          <button
            onClick={loadProducts}
            className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Clear filters
          </button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card group hover:scale-105 transition-transform">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="aspect-square w-full object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
                  <Package className="h-16 w-16 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-600">
                    Kyats {parseFloat(product.price).toFixed(2)}
                  </span>
                  <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                        ? `In Stock (${product.stock})`
                        : 'Out of Stock'}
                    </span>
                </div>
                <Link
                  to={`/products/${product.id}`}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>View Details</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

