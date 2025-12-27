import { useState, useEffect } from 'react';
import { productAPI, uploadAPI } from '../services/api';
import { Plus, Edit, Trash2, Package, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, {
          product_name: formData.name,
          product_description: formData.description,
          product_price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          product_image_url: formData.image_url || null,
        });
        toast.success('Product updated successfully');
      } else {
        await productAPI.create({
          id: formData.id ? parseInt(formData.id) : undefined,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          image_url: formData.image_url || null,
        });
        toast.success('Product created successfully');
      }
      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Product operation error:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action. Please contact an administrator.');
      } else if (error.response?.status === 401) {
        toast.error('Please login to continue');
      } else {
        toast.error(error.response?.data?.detail || error.message || 'Operation failed');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await productAPI.delete(productId);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: '',
    });
    setEditingProduct(null);
    setSelectedFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please select an image file (JPG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image_url: previewUrl });
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await uploadAPI.uploadImage(selectedFile);
      // Use the full URL with API base URL
      const fullImageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${response.image_url}`;
      setFormData({ ...formData, image_url: fullImageUrl });
      setSelectedFile(null);
      // Revoke the preview URL to free memory
      if (formData.image_url && formData.image_url.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image_url);
      }
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to upload images');
      } else if (error.response?.status === 401) {
        toast.error('Please login to upload images');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to upload image');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    // Revoke preview URL if it's a blob URL
    if (formData.image_url && formData.image_url.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image_url);
    }
    setFormData({ ...formData, image_url: '' });
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('image-file-input');
    if (fileInput) fileInput.value = '';
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Product Management
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                  <Package className="h-16 w-16 text-primary-600" />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  Kyats {parseFloat(product.price).toFixed(2)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingProduct && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product ID
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  className="input-field"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input-field"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  required
                  className="input-field"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image (Optional)
                </label>
                
                {/* File Upload Section */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Upload from Local System
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="image-file-input"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-file-input"
                      className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors text-center text-sm text-gray-600"
                    >
                      {selectedFile ? selectedFile.name : 'Choose Image File'}
                    </label>
                    {selectedFile && (
                      <>
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                          <Upload className="h-4 w-4" />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Supported: JPG, PNG, GIF, WebP (Max 5MB)
                  </p>
                </div>

                {/* Image URL Input (Alternative) */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Or Enter Image URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData({ ...formData, image_url: e.target.value });
                      setSelectedFile(null);
                    }}
                    placeholder="https://example.com/image.jpg or /images/products/product.jpg"
                  />
                </div>

                {/* Image Preview */}
                {formData.image_url && (
                  <div className="mt-3 relative">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

