import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import '../Login/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  const {t} = useTranslation();

  const [registering, setRegistering] = useState(false);
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      setRegistering(false);
      return;
    }

    const { repeatPassword, ...dataToSend } = formData; // Exclude repeatPassword

    try {
      const response = await axiosInstance.post('/user/register', dataToSend);
      
      console.log('Registration successful:', response.data);
      navigate('/prijava');
      window.scroll(0, 0);
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again later.');
      setRegistrationFailed(true);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="auth-container">
      <Helmet>
        <title>{t('sitenames.register')}</title>
      </Helmet>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">{t('register.title')}</h1>
        <label>
          {t('register.email')}
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          {t('register.username')}
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          {t('register.password')}
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <label>
          {t('register.repeatPassword')}
          <input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} required />
        </label>
        <button
          type="submit"
          className="auth-submit"
          disabled={!formData.username || !formData.email || !formData.password || !formData.repeatPassword || registering}
        >
          {t('register.submit')}
        </button>
        <p>{t('register.haveAccount')} <Link to="/prijava">{t('register.login')}</Link></p>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
