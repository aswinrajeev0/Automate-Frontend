import { useQuery } from "@tanstack/react-query"
import { customerGrowth, dashboardData, workshopGrowth } from "../../services/admin/dashboardService"

export const useCustomerGrowth = (filter: string = "monthly") => {
    return useQuery({
        queryKey: ["user-growth", filter],
        queryFn:() => customerGrowth(filter)
    })
}

export const useDashboardData = () => {
    return useQuery({
        queryKey: ["dashboard-data"],
        queryFn: dashboardData
    })
}

export const useWorkshopGrowth = (filter: string = "monthly") => {
    return useQuery({
        queryKey: ["workshop-growth", filter],
        queryFn:() => workshopGrowth(filter)
    })
}