import { AxiosError } from "axios";
import { customerApi } from "../../api/customer.axios";
import { workshopApi } from "../../api/workshop.axios";

export const fetchConversations = async (userType: string) => {
    try {
        let response;
        if (userType === "customer") {
            response = await customerApi.get("/get-conversations")
        } else {
            response = await workshopApi.get("/get-conversations")
        }
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const fallbackUsers = async (userType: string) => {
    try {
        let response;
        if (userType === "customer") {
            response = await customerApi.get("/fallback-users")
        } else {
            response = await workshopApi.get("/fallback-user")
        }
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const startChat = async (userType: string, customerId: string, workshopId: string) => {
    try {
        let response;
        const body = {
            customerId,
            workshopId
        }
        if (userType === "customer") {
            response = await customerApi.post("/chat/start", body);
        } else {
            response = await workshopApi.post("/chat/start", body);
        }

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const getMessages = async (conversationId: string, userType: string) => {
    try {
        let response;

        if (userType === "customer") {
            response = await customerApi.get("/chat/messages", {
                params: {
                    conversationId
                }
            });
        } else {
            response = await workshopApi.get("/chat/messages", {
                params: {
                    conversationId
                }
            });
        }

        return response.data

    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}

export const markAsRead = async (conversationId: string, userType: string) => {
    try {
        let response;

        if (userType === "customer") {
            response = await customerApi.patch("/chat/messages/mark-read", {
                conversationId
            });
        } else {
            response = await workshopApi.patch("/chat/messages/mark-read", {
                conversationId
            });
        }

        return response.data
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            throw axiosError.response.data;
        } else {
            throw new Error("An unexpected error occurred.");
        }
    }
}