import { useQuery } from "@tanstack/react-query"
import { allRequests } from "../../services/admin/adminService"

export const useAllRequests = (page: number, limit: number, searchTerm: string) => {
    return useQuery({
        queryKey: ["all-requests", page, limit, searchTerm],
        queryFn: () => allRequests(page, limit, searchTerm)
    })
}