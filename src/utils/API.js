import { BASE_URL } from "./variables";

export const API = async ({ endpoint, method = 'GET', payload = null }) => {

    const url = `${BASE_URL}${endpoint}`;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };

    if (payload) {
        options.body = JSON.stringify(payload);
    }
    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error during API call');
    }

    return await response.json();
};

