import { adminApi } from "../../api/admin.axios"

export const customerGrowth = async (filter: string) => {
    try {
        const response = await adminApi.get("/customer-growth",{
            params: {
                filter
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}

export const dashboardData = async () => {
    try {
        const response = await adminApi.get("/dashboard-data")
        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export const workshopGrowth = async (filter: string) => {
    try {
        const response = await adminApi.get("/workshop-growth",{
            params: {
                filter
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}