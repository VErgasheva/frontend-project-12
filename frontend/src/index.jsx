import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link,
} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Provider } from 'react-redux';
import store from './store';
import Chat from './components/Chat.jsx';

const getToken = () => localStorage.getItem('token');

const Header = () => {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header style={{
      background: '#222', color: '#fff', padding: '12px 0', marginBottom: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <Link to="/" style={{
        color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: 22,
        letterSpacing: 1,
      }}>
        Hexlet Chat
      </Link>
      <div style={{ flex: 1 }} />
      {token && (
        <button
          onClick={handleLogout}
          style={{
            background: '#e45', color: '#fff', border: 'none', borderRadius: 4,
            padding: '5px 18px', fontSize: 16, cursor: 'pointer', marginRight: 35,
          }}
        >Выйти</button>
      )}
    </header>
  );
};

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
        validationSchema={yup.object({
          username: yup.string().required('Обязательное поле'),
          password: yup.string().required('Обязательное поле'),
        })}
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
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="username">Имя пользователя</label>
              <Field
                id="username"
                name="username"
                placeholder="Введите имя"
                style={{ width: '100%', padding: 8, marginTop: 5 }}
              />
              {errors.username && touched.username && (
                <div style={{ color: 'red', fontSize: 13 }}>{errors.username}</div>
              )}
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
              {errors.password && touched.password && (
                <div style={{ color: 'red', fontSize: 13 }}>{errors.password}</div>
              )}
            </div>
            {error && (
              <div style={{ color: 'red', marginBottom: 15 }}>
                {error}
              </div>
            )}
            <button type="submit" style={{ padding: '8px 20px' }} disabled={isSubmitting}>
              {isSubmitting ? 'Входим...' : 'Войти'}
            </button>
            <div style={{ marginTop: 18 }}>
              Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (getToken()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const schema = yup.object().shape({
    username: yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .required('Обязательное поле'),
    password: yup.string()
      .min(6, 'Не менее 6 символов')
      .required('Обязательное поле'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
      .required('Обязательное поле'),
  });

  return (
    <div style={{ maxWidth: 420, margin: '30px auto', padding: 22, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Регистрация</h2>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
            const response = await fetch('/api/v1/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: values.username,
                password: values.password,
              }),
            });
            if (response.status === 409) {
              setError('Пользователь с таким именем уже существует');
              setSubmitting(false);
              return;
            }
            if (!response.ok) {
              throw new Error('Ошибка регистрации');
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
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="username">Имя пользователя</label>
              <Field
                id="username"
                name="username"
                placeholder="От 3 до 20 символов"
                autoComplete="username"
                style={{ width: '100%', padding: 8, marginTop: 5 }}
              />
              {errors.username && touched.username && (
                <div style={{ color: 'red', fontSize: 13 }}>{errors.username}</div>
              )}
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="password">Пароль</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Не менее 6 символов"
                autoComplete="new-password"
                style={{ width: '100%', padding: 8, marginTop: 5 }}
              />
              {errors.password && touched.password && (
                <div style={{ color: 'red', fontSize: 13 }}>{errors.password}</div>
              )}
            </div>
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                autoComplete="new-password"
                style={{ width: '100%', padding: 8, marginTop: 5 }}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div style={{ color: 'red', fontSize: 13 }}>{errors.confirmPassword}</div>
              )}
            </div>
            {error && (
              <div style={{ color: 'red', marginBottom: 15 }}>
                {error}
              </div>
            )}
            <button type="submit" style={{ padding: '8px 20px' }} disabled={isSubmitting}>
              {isSubmitting ? 'Регистрируем...' : 'Зарегистрироваться'}
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
      <Header />
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
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </Provider>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
