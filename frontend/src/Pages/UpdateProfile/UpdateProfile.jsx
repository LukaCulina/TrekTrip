import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: '',
    description: '',
    image: null
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/user/${userId}`);
        const user = response.data;
        setFormData({
          username: user.username || '',
          description: user.description || '',
          image: null
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let profileData = {
        username: formData.username,
        description: formData.description
      };

      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('file', formData.image);

        const imageRes = await axiosInstance.post('/image', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        profileData.image = { id: imageRes.data.id };
      }

      const res = await axiosInstance.put(`/user/${userId}`, profileData);
      console.log('User updated:', res.data);

      if (formData.username) {
        localStorage.setItem('username', formData.username);
      }

      navigate('/profil');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="updateProfilePage">
      <Helmet><title>{t('sitenames.editProfile')}</title></Helmet>
      <h1>{t('editProfile.title')}</h1>
      <form className="updateProfileForm" onSubmit={handleSubmit}>
        <div className="formField">
          <label>{t('editProfile.username')}</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="formField">
          <label>{t('editProfile.description')}</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="formField">
          <label>{t('editProfile.profilPhoto')}</label>
          <div className="uploadArea" onClick={() => document.getElementById('fileInput').click()}>
            {formData.image && <img src={URL.createObjectURL(formData.image)} alt="preview" />}
            <p>{formData.image ? formData.image.name : t('editProfile.addPhoto')}</p>
            <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange} />
          </div>
        </div>
        <button type="submit" className="submitBtn">{t('editProfile.editButton')}</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
