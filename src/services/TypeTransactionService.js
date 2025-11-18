import axios from "axios";
import baseURL from "../constants/baseURL";

export const getTransactionAPI = async () => {
    const response = await axios.get(`${baseURL}/types`);
    return response.data;
};