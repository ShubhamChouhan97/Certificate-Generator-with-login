export const uploadFiles = async (excelFile, templateFile) => {
    const formData = new FormData();
    const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

    formData.append('excelFile', excelFile);
    formData.append('templateFile', templateFile);
  
    try {
      const response = await fetch(`${API_URL}/uploadfile/uploaddata`, {
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
  