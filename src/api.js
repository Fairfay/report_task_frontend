import axios from 'axios';

const api = axios.create();
const apiUrl = process.env.REACT_APP_API_URL;

api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        if (error.response && error.response.status === 401) {
            const refreshtoken = localStorage.getItem('refreshToken');
            if (!refreshtoken) {
                if (window.location.pathname === '/login') {
                    return Promise.reject(error);
                } else {
                    window.location.href = "/login";
                }
            }
            else {
                try {
                    const refreshresponse = await axios.post(`${apiUrl}api/identity/auth/jwt/refresh/`,
                        { 'refresh': refreshtoken },
                        { headers: { 'Authorization': 'Bearer ' + refreshtoken }, });
                    const newtoken = refreshresponse.data.access;
                    localStorage.setItem('token', newtoken);
                    error.config.headers['Authorization'] = `Bearer ${newtoken}`;
                    return axios(error.config);
                } catch (refresherror) {
                    return Promise.reject(refresherror);
                }
            }
        } 
        else {
            return Promise.reject(error);
        }
    }
);

export default api;