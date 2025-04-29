export const  getcertificate = async (id)=>{
    const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
    const response = await fetch(`${API_URL}/allbatch/getallbatchCertificate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id}),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
          throw new Error('Get batch failed');
      }
      console.log("getbatch",data);
        return data;
}