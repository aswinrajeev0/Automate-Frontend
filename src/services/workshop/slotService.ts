import { workshopApi } from "../../api/workshop.axios";
import { ITimeSlot } from "../../types/slots";

export const allSlots = async () => {
    try {
        const response = await workshopApi.get("/all-slots");
        return response.data;
    } catch (error: any) {
        throw error.responce.data;
    }
}

export const createSlots = async (data: ITimeSlot[]) => {
    try {
        const response = await workshopApi.post("/create-slots", {data});
        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export const deleteSlot = async (slotId: string) => {
    try {
        const response = await workshopApi.delete("/delete-slot",{
            params: {
                slotId
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export const toggleAvailability = async(slotId: string, isAvailable: boolean) => {
    try {
        const response = await workshopApi.patch("/toggle-slot-availabilty",{
            slotId,
            isAvailable
        })
        return response.data;
    } catch (error: any) {
       throw error.response.data 
    }
}