import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';

/**
 * Основной компонент приложения
 * Подключает маршруты из отдельного файла `routes.js`
 */
function App() {
  return (
      <div className="App" style={{display: 'flex', width: '100%'}}>
        <main style={{width: '100%'}}>
          {/* Динамическая загрузка маршрутов */}
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element}/>
            ))}
          </Routes>
        </main>
    </div>
  );
}

export default App;
