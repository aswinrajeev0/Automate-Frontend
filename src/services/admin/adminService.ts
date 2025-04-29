import { adminApi } from "../../api/admin.axios";

export const getAllCustomers = async ({
    page = 1,
    limit = 10,
    search = "",
}: {
    page: number;
    limit: number;
    search: string;
}) => {
    const response = await adminApi.get("/customers", {
        params: {
            page,
            limit,
            search,
        },
    });
    return response.data;
};

export const updateCustomerStatus = async (userId: string) => {
    try {
        const response = await adminApi.patch(`/customer-status/${userId}`, {});
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update status");
    }
};

export const getAllWorkshops = async ({
    page = 1,
    limit = 10,
    search = "",
}: {
    page: number;
    limit: number;
    search: string;
}) => {
    const response = await adminApi.get("/workshops", {
        params: {
            page,
            limit,
            search,
        },
    });
    return response.data;
}

export const updateWorkshopStatus = async (workshopId: string) => {
    try {
        const response = await adminApi.patch(`/workshop-status/${workshopId}`);
        return response.data
    } catch (error: any) {
        throw new Error(error.response.data.message || "Failed to update status")
    }
}

export const updateWorkshopApprovalStatus = async ({ 
    workshopId, 
    status, 
    reason 
}: { workshopId: string; status: string; reason?: string }) => {
    try {
        const response = await adminApi.patch('/workshop-approval', {
            workshopId,
            status,
            reason
        })

        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data || "Failed to change approval status")
    }
}

// export const getInActiveWorkshops = async ({
//     page = 1,
//     limit = 10,
//     search = "",
// }: {
//     page: number;
//     limit: number;
//     search: string;
// }) => {
//     const response = await adminApi.get("/workshops", {
//         params: {
//             page,
//             limit,
//             search,
//         },
//     });
//     return response.data;
// }

export const allRequests = async (page: number, limit: number, searchTerm: string) => {
    try {
        const response = await adminApi.get("/all-requests", {
            params: {
                page,
                limit,
                searchTerm
            }
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const allBookings = async (page: number, limit: number, filter: string) => {
    try {
        const response = await adminApi.get("all-bookings",{
            params: {
                page,
                limit,
                filter
            }
        })

        return response.data;
    } catch (error: any) {
        throw error.response.data
    }
}