import { workshopApi } from "../../api/workshop.axios";
import { IWorkshopAddress } from "../../hooks/workshop/useWorkshopProfile";
import { ChangePasswordData, WorkshopAddressEditFormData, WorkshopEditFormData } from "../../types/auth";

export const updateWorkshop = async (data: WorkshopEditFormData) => {
    try {
        const response = await workshopApi.put("/update-workshop", data);
        return response;
    } catch (error: any) {
        throw error.response.data
    }
}

export const workshopDelete = async () => {
    try {
        const response = await workshopApi.delete("/delete-workshop");
        return response;
    } catch (error: any) {
        throw error.response.data
    }
}

export const getWorkshopAddress = async (): Promise<IWorkshopAddress> => {
    try {
        const response = await workshopApi.get("/workshop-address");
        return response.data.address
    } catch (error: any) {
        throw error.response.data
    }
}

export const editWorkshopAddress = async (data: WorkshopAddressEditFormData) => {
    try {
        const response = await workshopApi.put("/edit-address", data);
        return response
    } catch (error: any) {
        throw error.response.data
    }
}

export const changeWorkshopPassword = async (data: ChangePasswordData) => {
    try {
        const response = await workshopApi.patch("/change-password", data);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}