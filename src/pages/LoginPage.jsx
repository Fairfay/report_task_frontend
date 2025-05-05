import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
} from '@mui/material';
import './styles/Login.css';

const LoginPage = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    // Отправка формы и запрос на авторизацию
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${apiUrl}api/identity/auth/jwt/create/`, {
            username: username,
            password: password
        }).then(response => {
            const { access } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', response.data.refresh);
            window.location.href = "/report";
        }).catch(error => {
            const status = error.response ? error.response.status : null;
            if (status === 401) {
                alert('Вы ввели неверный логин или пароль!');
            } else {
                alert(`Код ошибки: ${status}, ${error.response.data.errors[0].detail}`, error);
            }
        });
    };

    document.title = "Вход - Отчет доставок";

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Авторизация</h1>
                <TextField
                    className='custom-textfield'
                    label="Логин"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
                <TextField
                    className='custom-textfield'
                    label="Пароль"
                    type="password"
                    value={password}
                    required
                    onChange={handlePasswordChange}
                />
                <Button variant="outlined" type="submit">
                    Войти
                </Button>
            </form>
            <label className="reactVersion">{process.env.REACT_APP_VERSION}</label>
        </div>
    );
};

export default LoginPage;