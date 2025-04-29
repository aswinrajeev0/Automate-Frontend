import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChangePasswordData, CustomerEditUploadData } from "../../types/auth"
import { updateCustomer } from "../../services/customer/authServices"
import { changePassword, editCustomerAddress, getCustomerAddress } from "../../services/customer/customerProfileService"

export interface ICustomerAddress {
    country: string,
    state: string,
    city: string,
    streetAddress: string,
    buildingNo: string
}

export const useCustomerUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CustomerEditUploadData) => updateCustomer(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["customer-profile"]})
        },
        onError: (error: Error) => {
            console.error("Error in updating profile", error)
        }
    })
}

export const useCustomerAddress = () => {
    return useQuery<ICustomerAddress, Error>({
        queryKey: ["customer-address"],
        queryFn: getCustomerAddress
    });
};

export const useEditCustomerAddress = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ICustomerAddress) => editCustomerAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["customer-address"]})
        },
        onError: (error: Error) => {
            console.error("Error in editing address", error)
        }
    })
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordData) => changePassword(data),
        onError: (error: Error) => {
            console.error("Change password error", error)
        }
    })
}