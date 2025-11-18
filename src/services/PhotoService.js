import axios from "axios";
import baseURL from "../constants/baseURL";

export const getPhotoAPI = async () => {
    const response = await axios.get(`${baseURL}/me/photos`);
    return response.data;
};

export const getPhotoByIdAPI = async (id) => {
    const response = await axios.get(`${baseURL}/photos/${id}`);
    return response.data;
};

export const createPhotoAPI = async (photoData) => {
    const response = await axios.post(`${baseURL}/me/photos/upload`, photoData,{
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
   
};

export const deletePhotoAPI = async (id) => {
    return await axios.delete(`${baseURL}/me/photos/${id}`);
};

export const updatePhotoAPI = async (id, photoData) => {
    const response = await axios.put(`${baseURL}/me/photos/${id}`, photoData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};