import axios from "axios";

export const publicApi = axios.create({
	baseURL: import.meta.env.VITE_PUBLIC_URL || "http://localhost:5000/api/v1/public",
	withCredentials: true
})