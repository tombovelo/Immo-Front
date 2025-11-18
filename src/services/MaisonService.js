import axios from "axios";
import baseURL from "../constants/baseURL";

export const getHousesAPI = async () => {
    const response = await axios.get(`${baseURL}/maisons`);
    return response.data;
};

export const getHouseByIdAPI = async (id) => {
    const response = await axios.get(`${baseURL}/maisons/${id}`);
    return response.data;
};

export const updateHouseAPI = async (id, data) => {
    const response = await axios.put(`${baseURL}/me/maisons/${id}`, data);
    return response.data;
};

export const createHouseAPI = async (data) => {
    const response = await axios.post(`${baseURL}/me/maisons`, data);
    return response.data;
};

export const searchHouseAPI = async (searchParams) => {
    // Filtrer pour ne garder que les paramètres avec une valeur non nulle et non vide
    const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([, value]) => value !== '' && value != null)
    );
    const response = await axios.get(`${baseURL}/maisons/search`, { params: filteredParams });
    return response.data;
};

export const deleteHouseAPI = async (id) => {
    return await axios.delete(`${baseURL}/me/maisons/${id}`);
};

export const getMyHouseAPI = async () => {
    const response = await axios.get(`${baseURL}/me/maisons`);
    return response.data;
};


