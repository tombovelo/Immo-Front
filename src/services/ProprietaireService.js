import axios from "axios";
import baseURL from "../constants/baseURL";
import { handleError } from "../helpers/ErrorHandler";

export const getProprietaireAPI = async () => {
    const response = await axios.get(`${baseURL}/proprietaires`);
    return response.data;
};

export const getProfile = async () => {
    const response = await axios.get(`${baseURL}/me/profile`);
    return response.data;
};

// export const getProprietaireByIdAPI = async (id) => {
//     const response = await axios.get(`${baseURL}/proprietaires/${id}`);
//     return response.data;
// };

// export const createProprietaireAPI = async (proprietaireData) => {
//     const response = await axios.post(`${baseURL}/proprietaires`, proprietaireData);
//     return response.data;
// };

export const updateMyProfile = async (proprietaireData) => {
    try {
        const response = await axios.put(`${baseURL}/me/profile`, proprietaireData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// export const deleteProprietaireAPI = async (id) => {
//     return await axios.delete(`${baseURL}/admin/proprietaires/${id}`);
// };