import { updateWorkshopStatus } from "../../services/admin/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToaster } from "../ui/useToaster";
import { IWorkshop, WorkshopData } from "../../components/admin/workshops/Workshops";

export const useUpdateWorkshopStatusMutation = (currentPage: number, limit: number, search: string) => {
    const { successToast, errorToast } = useToaster();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (workshopId: string) => updateWorkshopStatus(workshopId),
        onMutate: async (workshopId) => {
            const queryKey = ["workshops", currentPage, limit, search];
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (oldData: WorkshopData) => {
                if (!oldData || !oldData.workshops) return oldData;

                return {
                    ...oldData,
                    workshops: oldData.workshops.map((workshop: IWorkshop) =>
                        workshop._id === workshopId
                            ? { ...workshop, isBlocked: !workshop.isBlocked }
                            : workshop
                    ),
                };
            });

            return { previousData, queryKey };
        },
        onSuccess: (data) => {
            successToast(data.message);
        },
        onError: (error: any, _, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(context.queryKey, context.previousData);
            }
            errorToast(error.response?.data?.message || "An error occurred");
        },
    });
};