export const  getbatch = async ()=>{
    const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
    const response = await fetch(`${API_URL}/allbatch/getallbatch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
          throw new Error('Get batch failed');
      }
      console.log("getbatch",data);
        return data;
}