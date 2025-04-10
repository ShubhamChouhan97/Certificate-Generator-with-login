import React, { useState, useEffect } from 'react';
import { DownloadBatch } from '../API/downloadbatch.js'; // Adjust the import path as necessary
const BatchForm = () => {
  const [name, setName] = useState('');
  const [batchId, setBatchId] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleSubmit = (e) => {
    DownloadBatch(batchId);
    e.preventDefault();
    console.log('Submitted Batch ID:', batchId);
    // Add logic here as needed
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        borderBottom: '1px solid #ccc',
        fontSize: '18px'
      }}>
        <button onClick={() => window.location.href = '/'}>Home</button>
        <div>{name && <strong>Welcome, {name}</strong>}</div>
      </div>

      {/* Centered Input Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '30px',
          border: '1px solid #ddd',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <label>
            Batch ID:
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              required
              style={{
                padding: '8px',
                marginTop: '5px',
                width: '250px'
              }}
            />
          </label>
          <button type="submit" style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BatchForm;
