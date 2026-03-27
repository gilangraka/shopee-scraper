import axios from 'axios';

class AxiosInstance {
    constructor() {
        this.instance = axios.create({
            baseURL: process.env.AXIOS_API_URL || 'http://localhost:3000/api',
        });

        this._initializeInterceptor();
    }

    _initializeInterceptor() {
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    getInstance() {
        return this.instance;
    }
}

const axiosInstance = new AxiosInstance().getInstance();

export default axiosInstance;