import { useQuery } from "@tanstack/react-query";

export interface IFeaturedWorkshop {
    _id: string;
    workshopId: string;
    name: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    image?: string
}

export type FeaturedWorkshopData = {
    workshops: IFeaturedWorkshop[];
};

type workshopsResponse<T> = {
    workshops: T;
};

export const useFeaturedWorkshopsQuery = <T extends FeaturedWorkshopData>(
    queryFunc: () => Promise<workshopsResponse<T>>
) => {
    return useQuery({
        queryKey: ["workshops"],
        queryFn: () => queryFunc(),
        placeholderData: (prevData) => prevData ? { ...prevData } : undefined,
    });
};