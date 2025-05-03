import { adminApi } from "../../api/admin.axios";
import { AdminLoginData } from "../../types/auth";

export const adminLogin = async (data: AdminLoginData) => {
    try {
        const response = await adminApi.post('/login', data);
        return response
    } catch (error: any) {
        console.log(error)
        throw error.response?.data;
    }
}

export const adminLogout = async () => {
    try {
        const response = await adminApi.post("/logout");
        return response.data
    } catch (error: any) {
        console.error(error)
        throw error.response?.data
    }
}