import { customerApi } from "../../api/customer.axios"

export const getWallet = async (limit = 10, page = 1 ) => {
    try {
        const response = await customerApi.get("/wallet",{
            params: {
                limit,
                page
            }
        })
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}

export const addMoney = async (amount: number) => {
    try {
        const response = await customerApi.post("/add-money",  {amount});
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}

export const walletPurchase = async (amount: number) => {
    try {
        const response = await customerApi.post("/wallet-purchase", {amount})
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}