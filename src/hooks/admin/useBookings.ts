import { useQuery } from "@tanstack/react-query"
import { allBookings } from "../../services/admin/adminService"

export const useAdminBookings = (page: number, limit: number, filter: string) => {
    return useQuery({
        queryKey: ["all-bookings",page, limit, filter],
        queryFn: () => allBookings(page, limit, filter)
    })
}