import axios from 'axios';

console.log('API URL:', process.env.REACT_APP_API_URL);
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export const setAccessTokenHeader = (token: String) => {
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export default instance;