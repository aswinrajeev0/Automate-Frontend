import { workshopApi } from "../../api/workshop.axios"

export const getWorkshopReviews = async () => {
    try {
        const response = await workshopApi.get("/workshop-reviews");
        return response.data
    } catch (error: any) {
        throw error.respose.next
    }
}