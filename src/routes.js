import LoginPage from './pages/LoginPage';
import ReportPage from './pages/ReportPage';

function NoMatch() {
    return (
      <div style={{ padding: 200, textAlign: 'center' }}>
        <h2>404: Page Not Found</h2>
        <p>Такой страницы нет, куда ты тыкаешь!</p>
      </div>
    );
}

const routes = [
  { path: '/', element: <LoginPage /> },
  { path: '/report', element: <ReportPage /> },
  { path: '*', element: <NoMatch /> }
];

export default routes;