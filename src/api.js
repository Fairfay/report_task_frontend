import axios from 'axios';
// Создание экземпляра Axios для API-запросов
const api = axios.create();
const apiUrl = process.env.REACT_APP_API_URL;
// Интерсептор ответов: обработка ошибок авторизации
api.interceptors.response.use(
    // Прямой путь — просто возвращаем успешный ответ
    response => {
        return response;
    },
    // Обработка ошибок
    async error => {
        // Проверяем, есть ли ответ от сервера и это ошибка 401 (неавторизован)
        if (error.response && error.response.status === 401) {
            const refreshtoken = localStorage.getItem('refreshToken');
            // Если нет refresh-токена — перенаправляем на логин
            if (!refreshtoken) {
                if (window.location.pathname === '/login') {
                    return Promise.reject(error);
                } else {
                    window.location.href = "/login";
                }
            }
            // Если refresh-токен есть — пытаемся обновить access-токен
            else {
                try {
                    const refreshresponse = await axios.post(`${apiUrl}api/identity/auth/jwt/refresh/`,
                        { 'refresh': refreshtoken },
                        { headers: { 'Authorization': 'Bearer ' + refreshtoken }, });
                    // Сохраняем новый токен и повторяем оригинальный запрос
                    const newtoken = refreshresponse.data.access;
                    localStorage.setItem('token', newtoken);
                    error.config.headers['Authorization'] = `Bearer ${newtoken}`;
                    return axios(error.config);
                } catch (refresherror) {
                    // Если обновление токена не удалось — выходим
                    return Promise.reject(refresherror);
                }
            }
        } 
        else {
            // Все остальные ошибки — возвращаем как есть
            return Promise.reject(error);
        }
    }
);

export default api;