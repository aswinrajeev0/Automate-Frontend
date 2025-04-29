import { useQuery } from "@tanstack/react-query";
import { WorkshopData } from "../../components/admin/workshops/Workshops";


interface FetchWorkshopsParams {
    page: number;
    limit: number;
    search: string;
}

type workshopsResponse<T> = {
    workshops: T;
    totalPages: number;
    currentPage: number;
};

export const useAllWorkshopsQuery = <T extends WorkshopData>(
    queryFunc: (params: FetchWorkshopsParams) => Promise<workshopsResponse<T>>,
    page: number,
    limit: number,
    search: string,
) => {
    return useQuery({
        queryKey: ["workshops", page, limit, search],
        queryFn: () => queryFunc({ page, limit, search }),
        placeholderData: (prevData) => prevData ? { ...prevData } : undefined,
    });
};