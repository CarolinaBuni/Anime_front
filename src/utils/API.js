import { BASE_URL } from "./variables";

export const API = async ({ endpoint, method = 'GET', payload = null }) => {

    const url = `${BASE_URL}${endpoint}`;

    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };

     // Solo agregar el Content-Type si el payload no es FormData
     if (payload && !(payload instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(payload);
    } else if (payload) {
        options.body = payload;
    }
    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error during API call');
    }

    // return await response.json();
    const responseData = await response.json();
    console.log("API response:", responseData);
    return responseData;
};

