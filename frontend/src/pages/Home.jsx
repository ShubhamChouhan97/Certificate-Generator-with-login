import React from 'react';
import styles from './home.module.css';
import Card from '../component/Card/index.jsx';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const handleGenerateCertificate = () => {
    navigate('/mainpage'); // Navigate to the MainPage component
  };

  const handleDownloadBatch = () => {
    navigate('/downloadbatch'); // Navigate to the DownloadBatch component
  };

  const handleDownloadById = () => {
    navigate('/downloadcertificate');
  };

  const handleViewAllCertificates = () => {
   navigate('/viewall')
  };

  return (
    <div className={styles.homePage}>
      {/* Top Right Welcome Message */}
      <div className={styles.welcomeMessage}>
        <h2>Welcome, {name}</h2>
      </div>

      {/* Centered Cards in Gray Box */}
      <div className={styles.cardContainerWrapper}>
        <div className={styles.cardContainer}>
          <div className={styles.cardGrid}>
            <Card
              title="Generate New Certificate Batch"
              onClick={handleGenerateCertificate}
              buttonText="Generate"
            />
            <Card
              title="Download Previous Batch Certificates"
              onClick={handleDownloadBatch}
              buttonText="Download"
            />
            <Card
              title="Download Certificate by ID"
              onClick={handleDownloadById}
              buttonText="Download by ID"
            />
            <Card
              title="View All Generated Certificates"
              onClick={handleViewAllCertificates}
              buttonText="View All"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
