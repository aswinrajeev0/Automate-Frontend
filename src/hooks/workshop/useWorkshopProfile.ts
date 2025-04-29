import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeWorkshopPassword, editWorkshopAddress, updateWorkshop, workshopDelete } from "../../services/workshop/workshopProfileService"
import { ChangePasswordData, WorkshopAddressEditFormData, WorkshopEditFormData } from "../../types/auth"

export interface IWorkshopAddress {
    country: string;
    state: string;
    city: string;
    streetAddress: string;
    buildingNo: string;
}


export const useWorkshopUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: WorkshopEditFormData) => updateWorkshop(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workshop-profile"] })
        },
        onError: (error: Error) => {
            console.error("Error in updating profile", error)
        }
    })
}

export const useWorkshopDelete = () => {
    return useMutation({
        mutationFn: workshopDelete,
        onError: (error: Error) => {
            console.error("Error deleting account", error)
        }
    })
}

export const useEditWorkshopAddress = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: WorkshopAddressEditFormData) => editWorkshopAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workshop-address"] })
        },
        onError: (error: Error) => {
            console.error("Error editing address", error)
        }
    })
}

export const useChangeWorkshopPassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordData) => changeWorkshopPassword(data),
        onError: (error: Error) => {
            console.error("Change password error", error)
        }
    })
}