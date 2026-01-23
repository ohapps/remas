import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://remas-api.ohapps.com' : 'http://localhost:8080'
});

export const setAccessTokenHeader = (token: String) => {
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export default instance;