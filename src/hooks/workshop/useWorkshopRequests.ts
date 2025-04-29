import { useMutation, useQuery } from "@tanstack/react-query"
import { allPendingRequests, requestDetails, acceptRequest, rejectRequest, pendingJobs, updateRequestStatus, finishedJobs } from "../../services/workshop/workshopRequestsService"
import { queryClient } from "../../lib/queryClient"

export const useAllPendingRequests = (currentPage: number, limit: number, searchTerm: string) => {
    return useQuery({
        queryKey: ["all-pending-requests", currentPage, limit, searchTerm],
        queryFn: () => allPendingRequests(currentPage, limit, searchTerm)
    })
}

export const useRequestDetails = (requestId: string) => {
    return useQuery({
        queryKey: ["request-details", requestId],
        queryFn: () => requestDetails(requestId),
        enabled: !!requestId
    })
}

export const useAcceptRequest = () => {
    return useMutation({
        mutationFn: (requestId: string) => acceptRequest(requestId),
        onSuccess: (_, requestId) => {
            queryClient.setQueryData(["request-details", requestId], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    request: {
                        ...oldData.request,
                        status: "accepted",
                    },
                };
            });

            queryClient.invalidateQueries({ queryKey: ["all-pending-requests"] });
        }
    })
}

export const useRejectRequest = () => {
    return useMutation({
        mutationFn: (requestId: string) => rejectRequest(requestId),
        onSuccess: (_, requestId) => {
            queryClient.setQueryData(["request-details", requestId], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    request: {
                        ...oldData.request,
                        status: "rejected",
                    },
                };
            });

            queryClient.invalidateQueries({ queryKey: ["all-pending-requests"] });
        }
    })
}

export const usePendingJobs = (currentPage: number, limit: number, searchTerm: string) => {
    return useQuery({
        queryKey: ["all-pending-jobs", currentPage, limit, searchTerm],
        queryFn: () => pendingJobs(currentPage, limit, searchTerm)
    })
}

export const useUpdateRequestStatus = () => {
    return useMutation({
        mutationFn: ({ status, requestId }: { status: string; requestId: string }) => updateRequestStatus({ status, requestId }),
        onSuccess: (_, variables) => {
            const { status, requestId } = variables;
            queryClient.setQueryData(["request-details", requestId], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    request: {
                        ...oldData.request,
                        status: status,
                    },
                };
            });

            queryClient.invalidateQueries({ queryKey: ["all-pending-jobs"] });
        }
    })
}

export const useFinishedJobs = (currentPage: number, limit: number, searchTerm: string) => {
    return useQuery({
        queryKey: ["finished-jobs", currentPage, limit, searchTerm],
        queryFn: () => finishedJobs(currentPage, limit, searchTerm)
    })
}