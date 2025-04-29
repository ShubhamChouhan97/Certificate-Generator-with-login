import React, { useState, useEffect } from 'react';
import './viewall.css'
import { getbatch } from '../API/getbatch';
import { getcertificate } from '../API/getCertificate';
import { DownloadBatch } from '../API/downloadbatch';


function Viewall() {
    const [name, setName] = useState('');
    const [openRow, setOpenRow] = useState(null); // to track which row is expanded
    const [batchData, setBatchData] = useState([]);
    const [certificateData, setCertificateData] = useState([]);
    const [loading, setLoading] = useState(true);
      useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
          setName(storedName);
        }
      }, []);
    

      async function fetchData() {
        try {
          const data = await getbatch();
          setBatchData(data);
        } catch (error) {
          console.error('Failed to fetch batch data', error);
        } finally {
          setLoading(false);
        }
      }
      
      useEffect(() => {
        fetchData();
      }, []);
    
    
      const handleViewAll = async (id) => {
       setLoading(true); // Show loading state
        setOpenRow(openRow === id ? null : id); // toggle open/close
     
    try {
        const data = await getcertificate(id); // Fetch certificate data for the batch
        setCertificateData(data); // Store certificate data
      } catch (error) {
        console.error('Failed to fetch certificate data', error);
      } finally {
        setLoading(false); // Hide loading state
      }
      };
    
      const handleDownloadAll = (id) => {
        DownloadBatch(id); // Call the download function with the batch ID
      };
      const handleView = (path) => {
        window.open(`http://localhost:5000${path}`, '_blank');
      };

      const handleDownload = async (path, fileName) => {
        try {
          const response = await fetch(`http://localhost:5000${path}`);
          const blob = await response.blob();
    
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
    
          document.body.appendChild(link);
          link.click();
          link.remove();
    
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Download failed:', error);
        }
      };

      
return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          borderBottom: '1px solid #ccc',
          fontSize: '18px',
        }}
      >
        <button onClick={() => (window.location.href = '/')}>Home</button>
        <div>{name && <strong>Welcome, {name}</strong>}</div>
      </div>

      <div className="container">
        <h1 className="heading">Batch Table</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="main-table">
            <thead>
              <tr className="table-header">
                <th>Sr.No</th>
                <th>Batch ID</th>
                <th>Certificate Count</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batchData.map((row, index) => (
                <React.Fragment key={row._id}>
                  <tr className="table-row">
                    <td>{index + 1}</td>
                    <td>{row.batchId}</td>
                    <td>{row.count}</td>
                    <td>{row.createdAt}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleDownloadAll(row.batchId)}
                        className="btn downloaw-btn"
                      >
                        Download All
                      </button>
                      <button
                        onClick={() => handleViewAll(row._id)}
                        className="btn view-btn"
                      >
                        {openRow === row._id ? 'Hide' : 'View All'}
                      </button>
                    </td>
                  </tr>

                  {openRow === row._id && (
                    <tr>
                      <td colSpan="5">
                        <table className="sub-table">
                          <thead>
                            <tr className="sub-table-header">
                              <th>Sr.No</th>
                              <th>Name</th>
                              <th>Certificate ID</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {certificateData.map((subRow, index) => (
                              <tr key={subRow._id}>
                                <td>{index + 1}</td> {/* SR.NO */}
                                <td>{subRow.name}</td> {/* Name */}
                                <td>{subRow.certificateId}</td> {/* Certificate ID */}
                                <td className="actions">
                                  <button
                                    onClick={() => handleDownload(subRow.certificatePath, subRow.name)}
                                    className="btn download-btn"
                                  >
                                    Download
                                  </button>
                                  <button
                                    onClick={() => handleView(subRow.certificatePath)}
                                    className="btn view-btn"
                                  >
                                    Preview
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default  Viewall
