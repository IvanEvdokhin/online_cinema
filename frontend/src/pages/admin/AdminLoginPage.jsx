import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@cinema.local');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Идём<span>в</span>кино</h1>
        <span className="page-header__subtitle">Администраторррская</span>
      </header>

      <main>
        <section className="login">
          <header className="login__header">
            <h2 className="login__title">Авторизация</h2>
          </header>
          <div className="login__wrapper">
            <form className="login__form" onSubmit={handleSubmit}>
              <label className="login__label" htmlFor="email">
                E-mail
                <input
                  className="login__input"
                  type="email"
                  id="email"
                  placeholder="example@domain.xyz"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label className="login__label" htmlFor="pwd">
                Пароль
                <input
                  className="login__input"
                  type="password"
                  id="pwd"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              {error && <p className="login__label">{error}</p>}
              <div className="text-center">
                <input value="Авторизоваться" type="submit" className="login__button" />
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
