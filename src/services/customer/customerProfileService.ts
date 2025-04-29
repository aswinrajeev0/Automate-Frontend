import { customerApi } from "../../api/customer.axios";
import { ICustomerAddress } from "../../hooks/customer/useCustomerProfile";
import { ChangePasswordData } from "../../types/auth";

export const getCustomerAddress = async (): Promise<ICustomerAddress> => {
    try {
        const response = await customerApi.get("/customer-address");
        return response.data.address
    } catch (error: any) {
        throw error.response.data
    }
}

export const editCustomerAddress = async (data: ICustomerAddress): Promise<ICustomerAddress> => {
    try {
        const response = await customerApi.put("/edit-address", data);
        return response.data.address
    } catch (error: any) {
        throw error.response.data
    }
}

export const changePassword = async (data: ChangePasswordData) => {
    try {
        const response = await customerApi.patch("/change-password", data);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}