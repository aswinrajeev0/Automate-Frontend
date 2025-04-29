import { customerApi } from "../../api/customer.axios"

export const createOrder = async (orderCreationData: { amount: number, currency: string }) => {
    try {
        const response = await customerApi.post("/create-order", orderCreationData)
        return response.data
    } catch (error: any) {
        error.response.data
    }
}

export const verifyPayment = async (verificationData: {
    order_id: string;
    payment_id: string;
    razorpay_signature: string;
}) => {
    try {
        const response = await customerApi.post("/verify-payment", verificationData);
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}