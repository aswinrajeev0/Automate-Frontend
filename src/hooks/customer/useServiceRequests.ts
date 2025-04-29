import { useMutation, useQuery } from "@tanstack/react-query"
import { ICarLiftdata, IMobileWorkshop } from "../../types/requests"
import { carLiftRequest, getAllRequests, mobileWorkshopRequest } from "../../services/customer/requestServices"

export const useCarLiftRequest = () => {
    return useMutation({
        mutationFn: (data: ICarLiftdata) => carLiftRequest(data),
        onError: (error: Error) => {
            console.error("Error in requesting car lift", error);
        }
    })
}

export const useMobileWorkshopRequest = () => {
    return useMutation({
        mutationFn: (data: IMobileWorkshop) => mobileWorkshopRequest(data)
    })
}

export const useGetAllRequests = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ["all-requests"],
        queryFn: () => getAllRequests(page, limit)
    })
}