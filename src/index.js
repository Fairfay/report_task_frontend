import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router} from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import './styles/styles.css';
// Создание корневого элемента для React-приложения
const root = ReactDOM.createRoot(document.getElementById('root'));
// Монтирование основного приложения с поддержкой:
// - Темизация (ThemeProvider)
// - Роутинг (Router)
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
// Отправка метрик производительности (например, LCP, FID)
reportWebVitals();