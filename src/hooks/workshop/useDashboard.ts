import { useQuery } from "@tanstack/react-query"
import { dashboardData, getEarningsChartData, getGrowtChartData } from "../../services/workshop/workshop-dashboard.service"

export const useDashboardData = () => {
    return useQuery({
        queryKey: ["dashboardData"],
        queryFn: dashboardData
    })
}

export const useGetGrowtChartData = (timeFrame: string) => {
    return useQuery({
        queryKey: ["growth-chart-data", timeFrame],
        queryFn: () => getGrowtChartData(timeFrame)
    })
}

export const useGetEarningsChartData = (timeFrame: string) => {
    return useQuery({
        queryKey: ["earnings-chart-data", timeFrame],
        queryFn: () => getEarningsChartData(timeFrame)
    })
}