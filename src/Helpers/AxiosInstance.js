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

    async init() {
        try {
            const email = process.env.SCRAPER_EMAIL;
            const password = process.env.SCRAPER_PASSWORD;

            const response = await this.instance.post('/login/scraper', {
                email,
                password,
            });

            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token);
            }
        } catch (error) {
            console.error('Init login failed:', error);
        }
    }

    getInstance() {
        return this.instance;
    }
}

const axiosClass = new AxiosInstance();

await axiosClass.init();

const axiosInstance = axiosClass.getInstance();

export default axiosInstance;