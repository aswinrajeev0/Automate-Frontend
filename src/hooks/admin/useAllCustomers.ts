import { useQuery } from "@tanstack/react-query";
import { ICustomer } from "../../components/admin/customers/Customers";


interface FetchCustomersParams {
    page: number;
    limit: number;
    search: string;
}

export type customersResponse = {
    users: ICustomer[];
    totalPages: number;
    currentPage: number;
};

export const useAllCustomersQuery = (
    queryFunc: (params: FetchCustomersParams) => Promise<customersResponse>,
    page: number,
    limit: number,
    search: string
) => {
    return useQuery({
        queryKey: ["customers", page, limit, search],
        queryFn: () => queryFunc({ page, limit, search }),
        placeholderData: (prevData) => prevData ? { ...prevData } : undefined,
    });
};