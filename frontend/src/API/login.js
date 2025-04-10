export const login = async (userData) => {
    const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }
    const name = data.userData.userName;
    const id = data.userData.id;
    const email = data.userData.email;
   // save to localstorage
   localStorage.setItem('name', name);
   localStorage.setItem('id', id);
   localStorage.setItem('email', email);

    return data;
    };