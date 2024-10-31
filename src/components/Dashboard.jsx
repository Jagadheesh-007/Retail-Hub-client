// src/ProductDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './/Dashboard.css'; // Import the CSS file

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState('');
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const newProduct = { userId, productName, productQuantity, price };
    if (editingProductId) {
      await axios.put(`http://localhost:5000/api/products/${editingProductId}`, newProduct);
      setEditingProductId(null);
    } else {
      await axios.post('http://localhost:5000/api/products', newProduct);
    }
    clearForm();
    fetchProducts();
  };

  const editProduct = (product) => {
    setEditingProductId(product._id);
    setUserId(product.userId);
    setProductName(product.productName);
    setProductQuantity(product.productQuantity);
    setPrice(product.price);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const clearForm = () => {
    setUserId('');
    setProductName('');
    setProductQuantity(0);
    setPrice(0);
  };

  return (
    <div className="dashboard-container">
      <h1>Product Dashboard</h1>
      <form onSubmit={addProduct} className="product-form">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Product Quantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <button type="submit">{editingProductId ? 'Update Product' : 'Add Product'}</button>
      </form>

      <h2>Product List</h2>
      <ul className="product-list">
        {products.map(product => (
          <li key={product._id} className="product-item">
            <div className="progress-bar-container">
              <CircularProgressbar 
                value={product.productQuantity} 
                maxValue={100} // Adjust according to your needs
                text={`${product.productQuantity}`} 
              />
            </div>
            <div className="product-info">
              <strong>{product.userId}</strong> - {product.productName} - ${product.price.toFixed(2)}
              <div className="product-actions">
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => deleteProduct(product._id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDashboard;
