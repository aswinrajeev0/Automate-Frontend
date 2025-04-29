import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { allSlots, createSlots, deleteSlot, toggleAvailability } from "../../../services/workshop/slotService"
import { ITimeSlot } from "../../../types/slots"

export const useAllSlots = () => {
    return useQuery({
        queryKey: ["all-slots"],
        queryFn: allSlots
    })
}

export const useCreateSlots = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ITimeSlot[]) => createSlots(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["all-slots"]})
        }
    })
}

export const useDeleteSlot = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (slotId: string) => deleteSlot(slotId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["all-slots"]})
        }
    })
}

export const useToggleAvailableSlots = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({slotId, isAvailable}:{slotId: string, isAvailable: boolean}) => toggleAvailability(slotId, isAvailable),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["all-slots"]})
        }
    })
}