import { AxiosError } from "axios";
import { customerApi } from "../../api/customer.axios"
import { publicApi } from "../../api/public.axios";
import { IReveiwSubmitData, WorkshopDetailsResponse } from "../../hooks/customer/useWorkshops";


export const workshopDetails = async (id: string): Promise<WorkshopDetailsResponse> => {
    try {
        const response = await publicApi.get(`/workshop-details/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const submitReview = async (data: IReveiwSubmitData) => {
    try {
        const response = await customerApi.post("/submit-review", data);
        return response
    } catch (error: any) {
        throw error.response.data
    }
}

export const getAllWorkshops = async (page: number, limit: number = 8, searchQuery: string = "", sortOption: string) => {
    try {
        const response = await publicApi.get("/all-workshops", {
            params: {
                page,
                limit,
                searchQuery,
                sortOption
            }
        })
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}

export const handleFavorite = async (workshopId: string, status: boolean) => {
    try {
        const body = {
            workshopId,
            status: status ? "add-to-favorites" : "remove-from-favorites"
        }
        const response = await customerApi.post("/handle-favorites", body)

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const isFavorite = async (workshopId: string) => {
    try {
        const response = await customerApi.get("/is-favorite", {
            params: {
                workshopId
            }
        })

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const favorites = async (page: number, limit: number) => {
    try {
        const response = await customerApi.get("/favorites", {
            params: {
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const favoriteWorkshopIds = async () => {
    try {
        const response = await customerApi.get("/favorite-workshop-ids");
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}