import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cancelBooking, changeWorkshopStatus, getAllWorkshopBookings } from "../../../services/workshop/bookingService"

export const useGetAllWorkshopBookings = (page: number, limit: number, searchTerm: string, statusFilter: string) => {
    return useQuery({
        queryKey: ["all-workshop-bookings", page, limit, searchTerm, statusFilter],
        queryFn: () => getAllWorkshopBookings(page, limit, searchTerm, statusFilter)
    })
}

export const useCancelBooking = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (workshopId: string) => cancelBooking(workshopId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-workshop-bookings"] })
        }
    })
}

export const useChangeBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({bookingId, newStatus}:{bookingId: string; newStatus: string}) => changeWorkshopStatus(bookingId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["all-workshop-bookings"]})
        }
    })
}