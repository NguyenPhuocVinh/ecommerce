import axios from "axios";

export const BASE_URL = "http://localhost:4000/api/v1";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const setAuthToken = (token: string) => {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
    delete axiosInstance.defaults.headers.common["Authorization"];
};

export const getAuthToken = () => {
    return axiosInstance.defaults.headers.common["Authorization"];
};  
