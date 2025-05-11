import axiosInstance from "../../axios/axiosInstance";

const API_URL = '/trip'; 

const getAllTrips = () => {
    return axiosInstance.get(`${API_URL}/all`);
};

const getTripById = (id) => {
    return axiosInstance.get(`${API_URL}/${id}`);
};

const createTrip = (trip) => {
    return axiosInstance.post(API_URL, trip);
};

const updateTrip = (id, trip) => {
    return axiosInstance.put(`${API_URL}/${id}`, trip);
};

const deleteTrip = (id) => {
    return axiosInstance.delete(`${API_URL}/${id}`);
};

export default {
    getAllTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
};
