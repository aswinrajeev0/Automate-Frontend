import axios from "axios";

export const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:5000/api/v1/auth",
    withCredentials: true
})