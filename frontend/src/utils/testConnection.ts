// Test backend connection
import axios from 'axios';

export const testBackendConnection = async () => {
    try {
        console.log('Testing backend connection...');
        const response = await axios.get('http://localhost:5000');
        console.log('✅ Backend is running:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        return false;
    }
};

export const testAPIEndpoint = async () => {
    try {
        console.log('Testing API endpoint...');
        const response = await axios.get('http://localhost:5000/api/v1/auth/register');
        console.log('✅ API endpoint accessible');
        return true;
    } catch (error) {
        console.error('❌ API endpoint failed:', error);
        return false;
    }
};
