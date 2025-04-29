import { publicApi } from "../../api/public.axios";

export const getFeaturedWorkshops = async () => {
    const response = await publicApi.get("/workshops/featured");
    return response.data;
}