import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminProductAPI } from '../../services/api';
import '../../styles/admin/ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    mrp: '',
    sellingPrice: '',
    shortDescription: '',
    longDescription: '',
    features: [''],
    applications: [''],
    typeOfMachine: '',
    voltage: '',
    frequency: '',
    powerSource: '',
    burningAbility: '',
    weight: '',
    dimensions: '',
    paymentType: '',
    warranty: '',
    colors: [{ name: '', hexCode: '' }],
    material: '',
    itemCode: '',
    burningCapacity: '',
    packagingDetails: '',
    stockAvailable: '',
    lowStockAlert: '5',
    stockStatus: 'In Stock',
    deliveryTime: '',
    minOrderQuantity: '1',
    customizationAvailable: false,
    shippingTime: '',
    freeShipping: false,
    shippingWeight: '',
    noRefund: false,
    exchangeOnly: true,
    inHouseManufacturing: false,
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    metaTitle: '',
    metaDescription: '',
    keywords: [''],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [youtubeUrls, setYoutubeUrls] = useState([{ url: '', title: '', description: '' }]);

  const handleYouTubeChange = (index, field, value) => {
    const newYoutubeUrls = [...youtubeUrls];
    newYoutubeUrls[index][field] = value;
    setYoutubeUrls(newYoutubeUrls);
  };

  const addYouTubeUrl = () => {
    setYoutubeUrls([...youtubeUrls, { url: '', title: '', description: '' }]);
  };

  const removeYouTubeUrl = (index) => {
    if (youtubeUrls.length > 1) {
      setYoutubeUrls(youtubeUrls.filter((_, i) => i !== index));
    }
  };

  // Color handlers
  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', hexCode: '' }],
    });
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData({ ...formData, colors: newColors });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/categories?isActive=true`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories);

        // If creating new product, set default category if available
        if (!isEditMode && data.categories.length > 0) {
          // Find "Incinerator Machines" category or use first category
          const defaultCategory = data.categories.find(cat =>
            cat.name === 'Incinerator Machines'
          ) || data.categories[0];

          if (defaultCategory) {
            setFormData(prev => ({
              ...prev,
              category: defaultCategory._id
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await adminProductAPI.getById(id);
      // await adminProductAPI.create(formData);
      // await adminProductAPI.update(id, formData);

      if (response.data.success) {
        const product = response.data.product;

        setFormData({
          name: product.name || '',
          category: product.category?._id || product.category || '',
          subcategory: product.subcategory || '',
          mrp: product.price?.mrp || '',
          sellingPrice: product.price?.selling || '',
          shortDescription: product.description?.short || '',
          longDescription: product.description?.long || '',
          features: product.features?.length ? product.features : [''],
          applications: product.applications?.length ? product.applications : [''],
          typeOfMachine: product.specifications?.typeOfMachine || '',
          voltage: product.specifications?.voltage || '',
          frequency: product.specifications?.frequency || '',
          powerSource: product.specifications?.powerSource || '',
          burningAbility: product.specifications?.burningAbility || '',
          weight: product.specifications?.weight || '',
          dimensions: product.specifications?.dimensions || '',
          paymentType: product.specifications?.paymentType || '',
          warranty: product.specifications?.warranty || '',
          colors: product.specifications?.colors?.length
            ? product.specifications.colors
            : [{ name: '', hexCode: '' }],
          material: product.specifications?.material || '',
          itemCode: product.specifications?.itemCode || '',
          burningCapacity: product.specifications?.burningCapacity || '',
          packagingDetails: product.specifications?.packagingDetails || '',
          stockAvailable: product.stock?.available || '',
          lowStockAlert: product.stock?.lowStockAlert || '5',
          stockStatus: product.stock?.status || 'In Stock',
          deliveryTime: product.additionalInfo?.deliveryTime || '',
          minOrderQuantity: product.additionalInfo?.minOrderQuantity || '1',
          customizationAvailable: product.additionalInfo?.customizationAvailable || false,
          shippingTime: product.shipping?.time || '',
          freeShipping: product.shipping?.freeShipping || false,
          shippingWeight: product.shipping?.weight || '',
          noRefund: product.policies?.noRefund || false,
          exchangeOnly: product.policies?.exchangeOnly || true,
          inHouseManufacturing: product.policies?.inHouseManufacturing || false,
          status: product.status || 'active',
          isFeatured: product.isFeatured || false,
          isNewArrival: product.isNewArrival || false,
          isBestSeller: product.isBestSeller || false,
          metaTitle: product.seo?.metaTitle || '',
          metaDescription: product.seo?.metaDescription || '',
          keywords: product.seo?.keywords?.length ? product.seo.keywords : [''],
        });

        // Set existing images
        if (product.images?.length) {
          setExistingImages(product.images);
        }

        // Set existing YouTube URLs
        if (product.youtubeUrls?.length) {
          setYoutubeUrls(product.youtubeUrls);
        } else {
          setYoutubeUrls([{ url: '', title: '', description: '' }]);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleArrayInputChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setImageFiles([...imageFiles, ...validFiles]);

    const previews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...previews]);
  };

  const removeNewImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (filename) => {
    if (!isEditMode) return;

    try {
      const response = await adminProductAPI.delete(`${id}/images/${filename}`);
      if (response.data.success) {
        setExistingImages(existingImages.filter(img => img !== filename));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Build product data
      const productData = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: {
          mrp: parseFloat(formData.mrp),
          selling: parseFloat(formData.sellingPrice),
        },
        description: {
          short: formData.shortDescription,
          long: formData.longDescription,
        },
        features: formData.features.filter(f => f.trim()),
        applications: formData.applications.filter(a => a.trim()),
        specifications: {
          typeOfMachine: formData.typeOfMachine,
          voltage: formData.voltage,
          frequency: formData.frequency,
          powerSource: formData.powerSource,
          burningAbility: formData.burningAbility,
          weight: formData.weight,
          dimensions: formData.dimensions,
          paymentType: formData.paymentType,
          warranty: formData.warranty,
          colors: formData.colors.filter(c => c.name.trim()),
          material: formData.material,
          itemCode: formData.itemCode,
          burningCapacity: formData.burningCapacity,
          packagingDetails: formData.packagingDetails,
        },
        stock: {
          available: parseInt(formData.stockAvailable) || 0,
          lowStockAlert: parseInt(formData.lowStockAlert) || 5,
          status: formData.stockStatus,
        },
        additionalInfo: {
          deliveryTime: formData.deliveryTime,
          minOrderQuantity: parseInt(formData.minOrderQuantity) || 1,
          customizationAvailable: formData.customizationAvailable,
        },
        shipping: {
          time: formData.shippingTime,
          freeShipping: formData.freeShipping,
          weight: parseFloat(formData.shippingWeight) || 0,
        },
        policies: {
          noRefund: formData.noRefund,
          exchangeOnly: formData.exchangeOnly,
          inHouseManufacturing: formData.inHouseManufacturing,
        },
        status: formData.status,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        seo: {
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          keywords: formData.keywords.filter(k => k.trim()),
        },
        youtubeUrls: youtubeUrls.filter(v => v.url.trim()),
      };

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('productData', JSON.stringify(productData));

      // Append image files
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Keep existing images in edit mode
      if (isEditMode) {
        formDataToSend.append('keepExistingImages', 'true');
      }

      let response;
      if (isEditMode) {
        // Use axios directly for FormData
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('adminToken');

        response = await fetch(`${apiUrl}/admin/products/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });

        const data = await response.json();
        if (data.success) {
          navigate('/admin/products');
        } else {
          setError(data.message || 'Failed to update product');
        }
      } else {
        // Create new product
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('adminToken');

        response = await fetch(`${apiUrl}/admin/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });

        const data = await response.json();
        if (data.success) {
          navigate('/admin/products');
        } else {
          setError(data.message || 'Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading product...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="product-form">
        <div className="form-header">
          <div>
            <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            <p>Fill in the product information below</p>
          </div>
          <button
            className="btn-secondary"
            onClick={() => navigate('/admin/products')}
          >
            <i className="fas fa-times"></i>
            Cancel
          </button>
        </div>

        {error && (
          <div className="error-message" style={{
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#c53030'
          }}>
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {/* Tabs */}
        <div className="form-tabs">
          <button
            className={activeTab === 'basic' ? 'active' : ''}
            onClick={() => setActiveTab('basic')}
          >
            <i className="fas fa-info-circle"></i>
            Basic Info
          </button>
          <button
            className={activeTab === 'details' ? 'active' : ''}
            onClick={() => setActiveTab('details')}
          >
            <i className="fas fa-list"></i>
            Features & Apps
          </button>
          <button
            className={activeTab === 'specifications' ? 'active' : ''}
            onClick={() => setActiveTab('specifications')}
          >
            <i className="fas fa-cog"></i>
            Specifications
          </button>
          <button
            className={activeTab === 'images' ? 'active' : ''}
            onClick={() => setActiveTab('images')}
          >
            <i className="fas fa-images"></i>
            Images
          </button>
          <button
            className={activeTab === 'youtube' ? 'active' : ''}
            onClick={() => setActiveTab('youtube')}
          >
            <i className="fas fa-video"></i>
            YouTube Videos
          </button>
          <button
            className={activeTab === 'seo' ? 'active' : ''}
            onClick={() => setActiveTab('seo')}
          >
            <i className="fas fa-search"></i>
            SEO & Status
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="form-section">
              <h2>Basic Information</h2>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Napkin Incinerator Machine (Pro-Max)"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter(cat => !cat.parentCategory)
                    .map((category) => (
                      <option key={category._id} value={category._id}> {/* Use _id as value */}
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>MRP (₹) *</label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    placeholder="9000"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    placeholder="4500"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Discount</label>
                  <input
                    type="text"
                    value={formData.mrp && formData.sellingPrice ?
                      `${Math.round(((formData.mrp - formData.sellingPrice) / formData.mrp) * 100)}%` :
                      '0%'
                    }
                    disabled
                    className="calculated-field"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Short Description</label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Brief product description (max 200 characters)"
                    rows="2"
                    maxLength="200"
                  />
                  <small>{formData.shortDescription.length}/200 characters</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Long Description</label>
                  <textarea
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed product description"
                    rows="6"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Features & Applications Tab */}
          {activeTab === 'details' && (
            <div className="form-section">
              <h2>Features & Applications</h2>

              <div className="array-field-group">
                <label>Key Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="array-field-item">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayInputChange('features', index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('features', index)}
                        className="btn-remove"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('features')}
                  className="btn-add"
                >
                  <i className="fas fa-plus"></i>
                  Add Feature
                </button>
              </div>

              <div className="array-field-group">
                <label>Applications</label>
                {formData.applications.map((app, index) => (
                  <div key={index} className="array-field-item">
                    <input
                      type="text"
                      value={app}
                      onChange={(e) => handleArrayInputChange('applications', index, e.target.value)}
                      placeholder={`Application ${index + 1}`}
                    />
                    {formData.applications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('applications', index)}
                        className="btn-remove"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('applications')}
                  className="btn-add"
                >
                  <i className="fas fa-plus"></i>
                  Add Application
                </button>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className="form-section">
              <h2>Technical Specifications</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Type of Machine</label>
                  <input
                    type="text"
                    name="typeOfMachine"
                    value={formData.typeOfMachine}
                    onChange={handleInputChange}
                    placeholder="e.g., AUTOMATIC"
                  />
                </div>

                <div className="form-group">
                  <label>Voltage</label>
                  <input
                    type="text"
                    name="voltage"
                    value={formData.voltage}
                    onChange={handleInputChange}
                    placeholder="e.g., 220V"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Frequency</label>
                  <input
                    type="text"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    placeholder="e.g., 50Hz"
                  />
                </div>

                <div className="form-group">
                  <label>Power Source</label>
                  <input
                    type="text"
                    name="powerSource"
                    value={formData.powerSource}
                    onChange={handleInputChange}
                    placeholder="e.g., Electricity (AC)"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Burning Ability</label>
                  <input
                    type="text"
                    name="burningAbility"
                    value={formData.burningAbility}
                    onChange={handleInputChange}
                    placeholder="e.g., 2-3 One time"
                  />
                </div>

                <div className="form-group">
                  <label>Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 9Kg"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 50 x 15 x 30 cm"
                  />
                </div>

                <div className="form-group">
                  <label>Warranty</label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 YEAR"
                  />
                </div>
              </div>

              {/* Colors Section - NEW */}
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Available Colors</label>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                    Add product colors with optional hex codes for accurate color display
                  </p>
                </div>
              </div>

              {formData.colors.map((color, index) => (
                <div key={index} className="form-row" style={{
                  background: '#f9f9f9',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label>Color Name *</label>
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                      placeholder="e.g., Blue, Pink, Red"
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Hex Code (Optional)</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={color.hexCode}
                        onChange={(e) => handleColorChange(index, 'hexCode', e.target.value)}
                        placeholder="#0000FF"
                        maxLength="7"
                      />
                      {color.hexCode && (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: color.hexCode,
                          border: '2px solid #ddd',
                          borderRadius: '4px',
                          flexShrink: 0
                        }}></div>
                      )}
                    </div>
                  </div>

                  {formData.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        height: '40px',
                        marginTop: '24px',
                        fontWeight: '500'
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addColor}
                className="btn-add"
                style={{
                  background: '#667eea',
                  color: 'white',
                  padding: '10px 20px',
                  marginBottom: '20px'
                }}
              >
                <i className="fas fa-plus"></i> Add Another Color
              </button>

              {/* Material field - Keep as is */}
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="e.g., Ceramic Coated Floor"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Item Code</label>
                  <input
                    type="text"
                    name="itemCode"
                    value={formData.itemCode}
                    onChange={handleInputChange}
                    placeholder="e.g., RMAX17079"
                  />
                </div>

                <div className="form-group">
                  <label>Burning Capacity</label>
                  <input
                    type="text"
                    name="burningCapacity"
                    value={formData.burningCapacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 400-600 PCS Per Day"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Packaging Details</label>
                  <input
                    type="text"
                    name="packagingDetails"
                    value={formData.packagingDetails}
                    onChange={handleInputChange}
                    placeholder="e.g., One Machine User Manual Power Cord"
                  />
                </div>
              </div>

              <h3 className="section-subtitle">Stock Management</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock Available *</label>
                  <input
                    type="number"
                    name="stockAvailable"
                    value={formData.stockAvailable}
                    onChange={handleInputChange}
                    placeholder="25"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Low Stock Alert</label>
                  <input
                    type="number"
                    name="lowStockAlert"
                    value={formData.lowStockAlert}
                    onChange={handleInputChange}
                    placeholder="5"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Status</label>
                  <select
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleInputChange}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Pre-Order">Pre-Order</option>
                  </select>
                </div>
              </div>

              <h3 className="section-subtitle">Shipping & Policies</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Delivery Time</label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 3-5 days"
                  />
                </div>

                <div className="form-group">
                  <label>Min Order Quantity</label>
                  <input
                    type="number"
                    name="minOrderQuantity"
                    value={formData.minOrderQuantity}
                    onChange={handleInputChange}
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="customizationAvailable"
                    checked={formData.customizationAvailable}
                    onChange={handleInputChange}
                  />
                  <span>Customization Available</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="freeShipping"
                    checked={formData.freeShipping}
                    onChange={handleInputChange}
                  />
                  <span>Free Shipping</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="noRefund"
                    checked={formData.noRefund}
                    onChange={handleInputChange}
                  />
                  <span>No Refund Policy</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="exchangeOnly"
                    checked={formData.exchangeOnly}
                    onChange={handleInputChange}
                  />
                  <span>Exchange Only</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="inHouseManufacturing"
                    checked={formData.inHouseManufacturing}
                    onChange={handleInputChange}
                  />
                  <span>In-House Manufacturing (OEM)</span>
                </label>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="form-section">
              <h2>Product Images</h2>

              <div className="image-upload-container">
                <div className="upload-area">
                  <input
                    type="file"
                    id="imageUpload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="imageUpload" className="upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Click to upload images</p>
                    <small>Supports: JPG, PNG, WEBP (Max 5MB each, up to 10 images)</small>
                  </label>
                </div>

                {/* Existing Images (in edit mode) */}
                {isEditMode && existingImages.length > 0 && (
                  <div>
                    <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Current Images</h3>
                    <div className="image-preview-grid">
                      {existingImages.map((filename, index) => (
                        <div key={`existing-${index}`} className="preview-item">
                          <img
                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/products/${filename}`}
                            alt={`Product ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeExistingImage(filename)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                          {index === 0 && (
                            <span className="primary-badge">Primary</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {imagePreview.length > 0 && (
                  <div>
                    <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>New Images to Upload</h3>
                    <div className="image-preview-grid">
                      {imagePreview.map((preview, index) => (
                        <div key={`new-${index}`} className="preview-item">
                          <img src={preview} alt={`New ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeNewImage(index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO & Status Tab */}
          {activeTab === 'seo' && (
            <div className="form-section">
              <h2>SEO Settings</h2>

              <div className="form-group full-width">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO optimized title"
                  maxLength="60"
                />
                <small>{formData.metaTitle.length}/60 characters</small>
              </div>

              <div className="form-group full-width">
                <label>Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO meta description"
                  rows="3"
                  maxLength="160"
                />
                <small>{formData.metaDescription.length}/160 characters</small>
              </div>

              <div className="array-field-group">
                <label>Keywords</label>
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="array-field-item">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => handleArrayInputChange('keywords', index, e.target.value)}
                      placeholder={`Keyword ${index + 1}`}
                    />
                    {formData.keywords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('keywords', index)}
                        className="btn-remove"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('keywords')}
                  className="btn-add"
                >
                  <i className="fas fa-plus"></i>
                  Add Keyword
                </button>
              </div>

              <h3 className="section-subtitle">Product Status</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="form-row checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span>Featured Product</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleInputChange}
                  />
                  <span>New Arrival</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleInputChange}
                  />
                  <span>Best Seller</span>
                </label>
              </div>
            </div>
          )}

          {/* YouTube Videos Tab */}
          {activeTab === 'youtube' && (
            <div className="form-section">
              <h2>YouTube Videos</h2>
              <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                Add YouTube video URLs to showcase your product. Videos will appear on the product detail page.
              </p>

              {youtubeUrls.map((video, index) => (
                <div key={index} className="youtube-video-group" style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                  background: '#f9f9f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: '600' }}>
                      <i className="fab fa-youtube" style={{ color: '#ff0000', marginRight: '8px' }}></i>
                      Video {index + 1}
                    </h3>
                    {youtubeUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeYouTubeUrl(index)}
                        style={{
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <i className="fas fa-times"></i> Remove
                      </button>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>YouTube URL *</label>
                      <input
                        type="url"
                        value={video.url}
                        onChange={(e) => handleYouTubeChange(index, 'url', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      />
                      <small style={{ color: '#666', fontSize: '12px' }}>
                        Paste the full YouTube video URL (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)
                      </small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Video Title</label>
                      <input
                        type="text"
                        value={video.title}
                        onChange={(e) => handleYouTubeChange(index, 'title', e.target.value)}
                        placeholder="e.g., How to Use This Product"
                        maxLength="100"
                      />
                      <small>{video.title?.length || 0}/100 characters</small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Video Description</label>
                      <textarea
                        value={video.description}
                        onChange={(e) => handleYouTubeChange(index, 'description', e.target.value)}
                        placeholder="Brief description of what this video shows..."
                        rows="3"
                        maxLength="200"
                      />
                      <small>{video.description?.length || 0}/200 characters</small>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addYouTubeUrl}
                className="btn-add"
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-plus"></i>
                Add Another Video
              </button>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;