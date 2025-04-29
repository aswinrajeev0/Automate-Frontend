import { useMutation } from "@tanstack/react-query";
import { adminLogin, adminLogout } from "../../services/admin/authService";
import { AdminLoginData } from "../../types/auth";

export const useAdminLogin = () => {
    return useMutation({
        mutationFn: (data: AdminLoginData) => adminLogin(data),
        onError: (error: Error) => {
            console.error(error)
        }
    })
}

export const useAdminLogout = () => {
    return useMutation({
        mutationFn: () => adminLogout(),
        onError: (error: Error) => {
            console.error(error)
        }
    })
}