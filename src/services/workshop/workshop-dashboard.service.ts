import { workshopApi } from "../../api/workshop.axios";

export const dashboardData = async () => {
    try {
        const response = await workshopApi.get("/dashboard");
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const getGrowtChartData = async (timeFrame: string) => {
    try {
        const response = await workshopApi.get("/growth-chart-data", {
            params: {
                timeFrame
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const getEarningsChartData = async (timeFrame: string) => {
    try {
        const response = await workshopApi.get("/earnings-chart-data", {
            params: {
                timeFrame
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}