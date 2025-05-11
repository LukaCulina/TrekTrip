import React, { useState, useEffect } from 'react';
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
          image: null // We don't set the image here
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

        profileData.imageId = imageRes.data.id;
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
    <div>
      <Helmet>
        <title>{t('sitenames.editProfile')}</title>
      </Helmet>
      <div className="formContainer" >
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label className="usernameLabel">
            {t('editProfile.username')}
            <input type="text" className="usernameInput" name="username" value={formData.username}
                   onChange={handleChange}/>
          </label>
          <label className="descriptionLabel">
            {t('editProfile.description')}
            <textarea name="description" className="descriptionInput" value={formData.description}
                      onChange={handleChange}/>
          </label>
          <label className="profilePhotoLabel">
            {t('editProfile.profile-photo')}
            <input type="file" name="image" className="profilePhotoInput" onChange={handleImageChange}/>
          </label>
          <button type="submit">{t('editProfile.editButton')}</button>
        </form>
      </div>

    </div>
  );
};

export default UpdateProfile;
