import { updateCustomerStatus } from "../../services/admin/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToaster } from "../ui/useToaster";
import { ICustomer } from "../../components/admin/customers/Customers";
import { customersResponse } from "./useAllCustomers";

export const useUpdateCustomerStatusMutation = (currentPage: number, limit: number, search: string) => {
    const { successToast, errorToast } = useToaster();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (customerId: string) => updateCustomerStatus(customerId),
        onMutate: async (customerId) => {
            const queryKey = ["customers", currentPage, limit, search];
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, (oldData: customersResponse) => {
                if (!oldData || !oldData.users) return oldData;

                return {
                    ...oldData,
                    users: oldData.users.map((customer: ICustomer) => 
                        customer._id === customerId
                            ? {...customer, isBlocked: !customer.isBlocked}
                            : customer
                    )
                }
            })

            return {previousData, queryKey}
        },
        onSuccess: (data) => {
            successToast(data.message);
        },
        onError: (error: any, _, context) => {
            if(context?.previousData) {
                queryClient.setQueryData(context.queryKey, context.previousData);
            }
            errorToast(error.response?.data?.message || "An error occurred");
        },
    });
};
