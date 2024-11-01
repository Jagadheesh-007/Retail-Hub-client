import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css';

import logo from '/src/assets/retail.png'; // Import your logo image


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

  const getCircleColor = (quantity) => {
    if (quantity >= 80) return '#4caf50';
    if (quantity >= 50) return '#ff9800';
    return '#f44336';
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logged out");
  };

  return (
    <>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: 'rgba(20, 19, 19, 0.529)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '40px', marginRight: '10px' }} />
          <h2 style={{ color: 'white', margin: 0 }}>SMART RETAIL HUB</h2>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 15px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </nav>

    <div className="background-image"></div>
    <div style={{ padding: '20px'}}>
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

      <h2>Circular Display-Product</h2>
      <div style={{ display: 'flex', gap: '35px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {products.map((product) => (
          <div key={product._id} style={{
            width: '150px',
            textAlign: 'center',
            border: '2px solid #313131',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        }}>
              <CircularProgressbar
                value={product.productQuantity}
                maxValue={100}
                text={`${product.productQuantity}%`}
                styles={buildStyles({
                  pathColor: getCircleColor(product.productQuantity),
                  textColor: '#000',
                  trailColor: '#d6d6d6',
                })}
              />
    
            <div className="product-info">
              <strong>{product.productName}</strong>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => editProduct(product)}style={{ marginRight: '5px', backgroundColor: '#0bdeb1', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Edit</button>
                <button onClick={() => deleteProduct(product._id)} style={{ backgroundColor: '#950e42', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2>Product List</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity (%)</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={`table-${item._id}`}>
              <td>{item.userId}</td>
              <td>{item.productName}</td>
              <td>{item.productQuantity}%</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  );
};

export default ProductDashboard;
