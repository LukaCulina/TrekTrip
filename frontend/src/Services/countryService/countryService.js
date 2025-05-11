import axiosInstance from "../../axios/axiosInstance";

const API_URL = '/country'; 

const getAllCountries = () => {
    return axiosInstance.get(`${API_URL}/all`);
};

const getCountryById = (id) => {
    return axiosInstance.get(`${API_URL}/${id}`);
};

const createCountry = (country) => {
    return axiosInstance.post(API_URL, country);
};

const updateCountry = (id, country) => {
    return axiosInstance.put(`${API_URL}/${id}`, country);
};

const deleteCountry = (id) => {
    return axiosInstance.delete(`${API_URL}/${id}`);
};

export default {
    getAllCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
};
