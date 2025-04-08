export const uploadFiles = async (excelFile, templateFile) => {
    const formData = new FormData();
    formData.append('excelFile', excelFile);
    formData.append('templateFile', templateFile);
  
    try {
      const response = await fetch('http://localhost:5000/uploadfile/uploaddata', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };
  