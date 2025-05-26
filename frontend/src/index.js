import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Provider } from 'react-redux';
import store from './store';
import Chat from './components/Chat';

const getToken = () => localStorage.getItem('token');

const PrivateRoute = ({ children }) => {
  const token = getToken();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const Home = () => (
  <Chat />
);

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (getToken()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ maxWidth: 400, margin: '30px auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Вход</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
            const response = await fetch('/api/v1/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            });
            if (!response.ok) {
              throw new Error('Неверные имя пользователя или пароль');
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/', { replace: true });
          } catch (e) {
            setError(e.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
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
            {error && (
              <div style={{ color: 'red', marginBottom: 15 }}>
                {error}
              </div>
            )}
            <button type="submit" style={{ padding: '8px 20px' }} disabled={isSubmitting}>
              {isSubmitting ? 'Входим...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

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
  <Provider store={store}>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </Provider>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);