export const uploadFiles = async (excelFile, templateFile) => {
    const formData = new FormData();
    const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
    const id = localStorage.getItem('id');
    const email = localStorage.getItem('email');
    formData.append('excelFile', excelFile);
    formData.append('templateFile', templateFile);
    formData.append('id', id);
    formData.append('email', email);
    try {
      const response = await fetch(`${API_URL}/uploadfile/uploaddata`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
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
  