import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/sales',
    headers: {
        'Content-Type': 'application/json',
    },
});

// REQUEST
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers?.set(
            'Authorization',
            `Bearer ${token}`
        );
    }

    return config;
});

// RESPONSE (auto refresh)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refresh = localStorage.getItem('refresh_token');

            if (refresh) {
                try {
                    const res = await axios.post(
                        'http://127.0.0.1:8000/api/token/refresh/',
                        { refresh }
                    );

                    localStorage.setItem(
                        'access_token',
                        res.data.access
                    );

                    originalRequest.headers.set(
                        'Authorization',
                        `Bearer ${res.data.access}`
                    );

                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = '/login'; // later
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
