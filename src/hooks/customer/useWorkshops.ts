import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleFavorite, favorites, getAllWorkshops, submitReview, workshopDetails, isFavorite, favoriteWorkshopIds } from "../../services/customer/workshopServices";

export interface IWorkshop {
    rating: number;
    id: string;
    workshopId: string;
    name: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    image?: string;
    bio?: string
}

export type WorkshopData = {
    workshops: IWorkshop[];
};

export type WorkshopDetailsResponse = {
    workshop: IWorkshop;
    reviews: IReview[];
};

export interface IReview {
    reviewId: string;
    workshopId: string;
    userId: {
        image?: string; _id?: string; name?: string
    };
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReveiwSubmitData {
    rating: number,
    comment: string,
    workshopId: string
}

export const useWorkshopsQuery = (
    page: number,
    limit: number,
    searchQuery: string,
    sortOption: string
) => {
    return useQuery({
        queryKey: ["workshops", page, limit, searchQuery, sortOption],
        queryFn: () => getAllWorkshops(page, limit, searchQuery, sortOption),
        placeholderData: (prevData) => prevData ? { ...prevData } : undefined,
    });
};

export const useWorkshopDetails = (id: string) => {
    return useQuery<WorkshopDetailsResponse, Error>({
        queryKey: ["workshop-details", id],
        queryFn: ({ queryKey }) => workshopDetails(queryKey[1] as string)
    })
}

export const useSubmitReview = () => {
    return useMutation({
        mutationFn: (data: IReveiwSubmitData) => submitReview(data),
        onError: (error: Error) => {
            console.error("Error submiting review", error)
        }
    })
}

export const useHandelFavorite = (page?: number, limit?: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({workshopId, status}: {workshopId: string, status: boolean}) => handleFavorite(workshopId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["favorites",page, limit]})
        }
    })
}

export const useIsFavorite = (workshopId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["isFavorite", workshopId],
        queryFn: () => isFavorite(workshopId),
        enabled: false
    })
}

export const useFavorites = (page: number, limit: number) => {
    return useQuery({
        queryKey: ["favorites",page, limit],
        queryFn: () => favorites(page, limit)
    })
}

export const useFavoriteWorkshopIds = (enabled: boolean) => {
    return useQuery({
        queryKey: ["workshopIds"],
        queryFn: favoriteWorkshopIds,
        enabled
    })
}