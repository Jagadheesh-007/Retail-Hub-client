// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ _id: '', name: '', quantity: 0, price: 0 });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch data on load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/data');
            setData(response.data);
        } catch (error) {
            setError('Error fetching data.');
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData._id || !formData.name || formData.quantity < 0 || formData.quantity > 100 || formData.price <= 0) {
            setError('Please enter valid details for the product, including a unique ID.');
            return;
        }
        setError('');
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/data/${editId}`, formData);
                setEditId(null);
            } else {
                await axios.post('http://localhost:5000/api/data', formData);
            }
            setFormData({ _id: '', name: '', quantity: 0, price: 0 });
            fetchData();
        } catch (error) {
            setError('Error saving data. Ensure the ID is unique.');
            console.error('Error saving data:', error);
        }
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setFormData({ _id: item._id, name: item.name, quantity: item.quantity, price: item.price });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        setError('');
        try {
            await axios.delete(`http://localhost:5000/api/data/${id}`);
            fetchData();
        } catch (error) {
            setError('Error deleting data.');
            console.error('Error deleting data:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Product Dashboard</h1>

            {/* Error Message */}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    name="_id"
                    placeholder="Product ID"
                    value={formData._id}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity (%)"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                    style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price per unit"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                    style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {editId ? 'Update' : 'Add'} Product
                </button>
            </form>

            {/* Loading State */}
            {loading && <p>Loading data...</p>}

            {/* Product List - Circular Display */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {data.map((item) => (
                    <div key={item._id} style={{
                            width: '150px',
                            textAlign: 'center',
                            border: '1px solid #ddd',
                            padding: '10px',
                            borderRadius: '8px',
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        }}>
                        <h3>{item.name}</h3>
                        <CircularProgressbar
                            value={item.quantity}
                            maxValue={100}
                            text={`${item.quantity}%`}
                            styles={buildStyles({
                                textColor: '#ffffff',
                                pathColor: '#3b82f6',
                                trailColor: '#d6d6d6',
                            })}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={() => handleEdit(item)} style={{ marginRight: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Edit</button>
                            <button onClick={() => handleDelete(item._id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity (%)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item._id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item._id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}%</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
