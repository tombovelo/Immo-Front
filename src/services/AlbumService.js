import axios from "axios";
import baseURL from "../constants/baseURL";


export const createAlbumAPI = async (formData) => {
    const response = await axios.post(`${baseURL}/me/albums`, formData);
    return response.data;
};

export const getAlbumAPI = async () => {
    const response = await axios.get(`${baseURL}/me/albums`);
    return response.data;
};

export const getAlbumByIdAPI = async (id) => {
    const response = await axios.get(`${baseURL}/albums/${id}`);
    return response.data;
};

export const deleteAlbumAPI = async (id) => {
    return await axios.delete(`${baseURL}/me/albums/${id}`);
};

export const updateAlbumAPI = async (id, albumData) => {
    const response = await axios.put(`${baseURL}/me/albums/${id}`, albumData);
    return response.data;
};

