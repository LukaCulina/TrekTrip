import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import './Auth.css';

const Login = () => {

  axios.defaults.baseURL = 'http://localhost:8080';

  const {t} = useTranslation();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [authenticating, setAuthenticating] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthenticating(true);
    setLoginFailed(false);
    setError('');

    const { username, password } = formData;

    try {
        const response = await axios.post('/auth/login', { username, password });
        
        const accessToken = response.data.accessToken;
        
        const  authToken  = response.data.token;

        login(authToken)

        console.log(authToken);
        console.log(accessToken);
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', accessToken);
        
        navigate('/');
        window.scroll(0, 0);
    } catch (error) {
        if (error.response) {
          console.error('Login failed:', error.response.data);
          setError("Molimo provjerite podatke")
      } else if (error.request) {
          console.error('No response received:', error.request);
      } else {
          console.error('Error during login:', error.message);
      }
      setLoginFailed(true);
    } finally {
      setAuthenticating(false);
    }

};
  
    return (
      <div className="auth-container">
        <Helmet>
          <title>{t('sitenames.login')}</title>
        </Helmet>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className='auth-title'>{t('login.title')}</h1>
          <label>
            {t('login.username')}
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="Unesite korisničko ime"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={authenticating}
            />
          </label>
          <label>
            {t('login.password')}
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Unesite lozinku"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={authenticating}
            />
          </label>
          <div className='remember'>
            <label className="auth-checkbox">
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                <p>{t('login.remember')}</p>
              </label>
            <p>{t('login.forgotten')}</p>
          </div>
          <button
            type="submit"
            className="auth-submit"
            disabled={!formData.username || !formData.password || authenticating}
          >
            {t('login.submit')}
            {authenticating && <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>}
          </button>
          {loginFailed && <div className="alert alert-danger mt-3">{t('login.failed')}</div>}
          <p>{t('login.noAccount')} <Link to="/registracija">{t('login.register')}</Link></p>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    );
};

export default Login;
