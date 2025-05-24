import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';

const Home = () => (
  <h1>Hexlet Chat</h1>
);

const Login = () => (
  <div style={{ maxWidth: 400, margin: '30px auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
    <h2>Вход</h2>
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={() => {}}
    >
      {() => (
        <Form>
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="username">Имя пользователя</label>
            <Field
              id="username"
              name="username"
              placeholder="Введите имя"
              style={{ width: '100%', padding: 8, marginTop: 5 }}
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="password">Пароль</label>
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Введите пароль"
              style={{ width: '100%', padding: 8, marginTop: 5 }}
            />
          </div>
          <button type="submit" style={{ padding: '8px 20px' }}>Войти</button>
        </Form>
      )}
    </Formik>
  </div>
);

const NotFound = () => {
  const location = useLocation();
  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>404 - Страница не найдена</h2>
      <p>Нет маршрута для <code>{location.pathname}</code></p>
      <a href="/">На главную</a>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
