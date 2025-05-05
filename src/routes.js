import LoginPage from './pages/LoginPage';
import ReportPage from './pages/ReportPage';
/**
 * Компонент для отображения страницы 404
 * Используется как fallback при переходе на несуществующий маршрут
 */
function NoMatch() {
    return (
      <div style={{ padding: 200, textAlign: 'center' }}>
        <h2>404: Page Not Found</h2>
        <p>Такой страницы нет, куда ты тыкаешь!</p>
      </div>
    );
}
// Определение маршрутов приложения
const routes = [
  { path: '/', element: <LoginPage /> }, // Главная страница — форма входа
  { path: '/report', element: <ReportPage /> }, // Отчет по доставкам (защищенный маршрут)
  { path: '*', element: <NoMatch /> } // Обработка несуществующих маршрутов
];

export default routes;