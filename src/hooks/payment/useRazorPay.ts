import { useMutation } from "@tanstack/react-query"
import { createOrder, verifyPayment } from "../../services/payment/razorpay.service"

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: ({amount, currency}:{amount: number, currency: string}) => createOrder({amount, currency}),
        onError: (error) => {
            console.error("Error creating razorpay order", error)
        }
    })
}

export const useVerifyPayment = () => {
    return useMutation({
        mutationFn: (verificationData: {
            order_id: string;
            payment_id: string;
            razorpay_signature: string;
        }) => verifyPayment(verificationData)
    })
}