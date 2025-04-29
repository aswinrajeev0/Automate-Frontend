import { useMutation, useQuery } from "@tanstack/react-query"
import { getReportBookings, getReportRequests, pdfDownload, revenueReportPageData } from "../../services/admin/revenueReportService"

export const useReportPageData = () => {
    return useQuery({
        queryKey: ["report-data"],
        queryFn: () => revenueReportPageData()
    })
}

export const useReportRequests = ({ startDate, endDate, page, limit }: { startDate: Date; endDate: Date; page: number; limit: number }) => {
    return useQuery({
        queryKey: ["report-requests", startDate, endDate, page, limit],
        queryFn: () => getReportRequests({ startDate, endDate, page, limit })
    })
}

export const useReportBookings = ({ startDate, endDate, page, limit }: { startDate: Date; endDate: Date; page: number; limit: number }) => {
    return useQuery({
        queryKey: ["report-bookings", startDate, endDate, page, limit],
        queryFn: () => getReportBookings({ startDate, endDate, page, limit })
    })
}

export const usePdfDownload = () => {
    return useMutation({
        mutationFn: ({ startDate, endDate, serviceType }: { startDate: Date; endDate: Date; serviceType: string }) =>
            pdfDownload({ startDate, endDate, serviceType }),
    });
};