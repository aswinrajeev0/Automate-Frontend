import { useQuery } from "@tanstack/react-query"
import { getWorkshopReviews } from "../../../services/workshop/workshopReview"

export const useWorkshopReview = () => {
    return useQuery({
        queryKey: ["workshop-reviews"],
        queryFn: getWorkshopReviews,
    })
}