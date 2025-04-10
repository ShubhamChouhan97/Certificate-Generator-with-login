
import React, { useState } from 'react';
import styles from './style.module.css';
import { uploadFiles } from '../../API/upload.js';

function Input({ setLength ,setbatchId }) {
  const [excelFile, setExcelFile] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!excelFile || !templateFile) {
      alert("Please upload both files.");
      return;
    }

    setIsLoading(true); // Start the spinner

    try {
      const result = await uploadFiles(excelFile, templateFile); // Upload
      const length = result.length;
      console.log("e",result)
      const batchId = result.batchId;
      setbatchId(batchId);
      setLength(length); // Correctly update parent's state
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsLoading(false); // Stop the spinner
    }
  };

  return (
    <div className={styles.main}>
      <h2>Upload Certificate Data and Template</h2>
      <div className={styles.inputdiv}>
        <div className={styles.fileGroup}>
          <label htmlFor="excelFile">Upload Excel File:</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            id="excelFile"
            onChange={(e) => setExcelFile(e.target.files[0])}
            disabled={isLoading}
          />
        </div>

        <div className={styles.fileGroup}>
          <label htmlFor="templateFile">Upload Template File (Word file only):</label>
          <input
            type="file"
            accept=".doc, .docx"
            id="templateFile"
            onChange={(e) => setTemplateFile(e.target.files[0])}
            disabled={isLoading}
          />
        </div>

        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <span className={styles.spinner}></span> : "Generate"}
        </button>
      </div>
    </div>
  );
}

export default Input;
