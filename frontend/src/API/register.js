export const registerUser = async (userData) => {
    const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
    console.log("Registering user:", userData);
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json(); 
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        else{
            alert("Registration successful! Please login to continue.");
            window.location.href = '/login'; // Redirect to login page after successful registration
        }
        return data;
    }
    catch (error) {
        throw error;
    }
}