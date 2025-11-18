import axios from "axios"
import { handleError } from "../helpers/ErrorHandler";
import baseURL from "../constants/baseURL";

export const loginAPI = async(email, password) => {
    try {
        const response = await axios.post(`${baseURL}/auth/login`, {
            email: email,
            password: password
        })
        return response.data;
    } catch(error) {
        handleError(error)
    }
}

export const registerAPI = async (formData) => {
    try {
      const response = await axios.post(`${baseURL}/auth/register`, formData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };