import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fallbackUsers, fetchConversations, getMessages, markAsRead, startChat } from "../../services/chat/fetchConversations"

export const useFetchConversations = (userType: string) => {
    return useQuery({
        queryKey: ["conversations", userType],
        queryFn: () => fetchConversations(userType)
    })
}

export const useFallbackUsers = (userType: string) => {
    return useQuery({
        queryKey: ["falback-users", userType],
        queryFn: () => fallbackUsers(userType)
    })
}

export const useStartChat = (userType: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ customerId, workshopId }: { customerId: string; workshopId: string }) => startChat(userType, customerId, workshopId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations", userType] })
        }
    })
}

export const useGetMessages = (conversationId: string, userType: string) => {
    return useQuery({
        queryKey: ["messages", conversationId, userType],
        queryFn: () => getMessages(conversationId, userType)
    })
}

export const useMarkAsRead = (userType: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (conversationId: string) => markAsRead(conversationId, userType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations", userType] })
        }
    })
}