import { useMutation } from '@tanstack/react-query'
import {
    registerCustomer,
    sendOtp,
    verifyOtp,
    loginCustomer,
    resetOtp,
    resetPassword,
    customerlogout,
    googleAuth,
    deleteCustomer
} from '../../services/customer/authServices'
import { CustomerRegisterData, CustomerLoginData, ResetPasswordFormData } from '../../types/auth'

export const useCustomerRegister = () => {
    return useMutation({
        mutationFn: (data: CustomerRegisterData) => registerCustomer(data),
        onError: (error: Error) => {
            console.error("Registraton error: ", error);
        }
    })
}

export const useSendOtp = () => {
    return useMutation({
        mutationFn: (email: string) => sendOtp(email),
        onError: (error: Error) => {
            console.error("Error sending otp: ", error)
        }
    })
}

export const useResetPasswordOtp = () => {
    return useMutation({
        mutationFn: (email: string) => resetOtp(email),
        onError: (error: Error) => {
            console.error("Error sending reset otp: ", error)
        }
    })
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: ({ email, otp }: { email: string, otp: string }) => verifyOtp(email, otp),
        onError: (error: Error) => {
            console.error("Verify email error: ", error)
        }
    })
}

export const useCustomerLogin = () => {
    return useMutation({
        mutationFn: (data: CustomerLoginData) => loginCustomer(data),
        onError: (error: Error) => {
            console.error(error)
        }
    })
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data: ResetPasswordFormData) => resetPassword(data),
        onError: (error: Error) => {
            console.error("Reset password error", error)
        }
    })
}

export const useCustomerLogout = () => {
    return useMutation({
        mutationFn: () => customerlogout(),
        onError: (error: Error) => {
            console.error("Error in customer logout", error)
        }
    })
}

export const useGoogleMutation = () => {
    return useMutation({
        mutationFn: googleAuth,
    })
};

export const useCustomerDelete = () => {
    return useMutation({
        mutationFn: deleteCustomer,
        onError: (error: Error) => {
            console.error("Error deleting account", error)
        }
    })
}