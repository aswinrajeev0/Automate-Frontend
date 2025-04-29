import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToaster } from "../ui/useToaster";
import { updateWorkshopApprovalStatus } from "../../services/admin/adminService";

export const useUpdateWorkshopApprovalStatusMutation = () => {
    const { successToast, errorToast } = useToaster();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            workshopId,
            status,
            reason
        }: { workshopId: string; status: string; reason?: string }) => updateWorkshopApprovalStatus({workshopId, status, reason}),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["workshops"] });
            successToast(data.message);
        },
        onError: (error: any) => {
            errorToast(error.response?.data?.message || "An error occurred");
        },
    });
}