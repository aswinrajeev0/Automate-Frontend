import { workshopApi } from "../../api/workshop.axios"

export const getAllWorkshopBookings = async (page: number, limit: number, searchTerm: string, statusFilter: string) => {
    try {
        const response = await workshopApi.get("/all-workshop-bookings",{
            params: {
                page,
                limit,
                searchTerm,
                statusFilter
            }
        })
        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export const cancelBooking = async (bookingId: string) => {
    try {
        const response = await workshopApi.patch("/cancel-booking",{
            bookingId
        })
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}

export const changeWorkshopStatus = async (bookingId: string, status: string) => {
    try {
        const response = await workshopApi.patch("/change-booking-status",{
            bookingId,
            status
        })
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}