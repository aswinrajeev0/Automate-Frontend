import { workshopApi } from "../../api/workshop.axios"

export const allPendingRequests = async (page: number = 1, limit: number = 10, searchTerm: string = "") => {
    try {
        const response = await workshopApi.get("/all-pending-requests", {
            params: {
                page,
                limit,
                searchTerm
            }
        });
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}

export const allBookings = async () => {
    try {
        const response = await workshopApi.get("/all-bookings");
        return response
    } catch (error: any) {
        throw error.response.data
    }
}

export const requestDetails = async (requestId: string) => {
    try {
        const response = await workshopApi.get(`/request-details/${requestId}`)
        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}

export const acceptRequest = async (requestId: string) => {
    try {
        const response = await workshopApi.patch(`/accept-request/${requestId}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const rejectRequest = async (requestId: string) => {
    try {
        const response = await workshopApi.patch(`/reject-request/${requestId}`);
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const pendingJobs = async (page: number = 1, limit: number = 10, searchTerm: string = "") => {
    try {
        const response = await workshopApi.get("/pending-jobs", {
            params: {
                page,
                limit,
                searchTerm
            }
        })
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const updateRequestStatus = async ({ status, requestId }: { status: string; requestId: string }) => {
    try {
        const response = await workshopApi.patch("/update-request-status", {
            status,
            requestId
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "An error occurred";
    }
};

export const finishedJobs = async (page: number = 1, limit: number = 10, searchTerm: string = "") => {
    try {
        const response = await workshopApi.get("/finished-jobs", {
            params: {
                page,
                limit,
                searchTerm
            }
        })
        return response.data
    } catch (error: any) {
        throw error.response.data
    }
}
