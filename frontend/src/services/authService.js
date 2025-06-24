import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
      email,
      password,
    });
    return response.data;
  },
};

export const signupService = {
  signup : async (formData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
    return res.data;
  },
};