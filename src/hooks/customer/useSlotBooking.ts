import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { allUserBookings, availableDates, bookedSlots, bookSlot, cancelSlot, checkSlotAvailability, fetchAvailableSlots, isSlotAvailable, saveSlotId } from "../../services/customer/slotService"
import { format } from "date-fns"

export interface BookSlot {
    bookingId?: string
    customerId?: string,
    workshopId?: string,
    time: string,
    date: Date,
    type: string,
    endTime: string,
    duration: number,
    price: number,
    amount: number,
    gst?: number,
    slotId?: string
}

export const useFetchAvailableSlots = (workshopId: string, selectedDate: Date, type: string) => {
    return useQuery({
        queryKey: ["workshopSlots", workshopId, selectedDate ? format(selectedDate, "yyyy-MM-dd") : null, type],
        queryFn: () => fetchAvailableSlots(workshopId, format(selectedDate, "yyyy-MM-dd"), type),
    })
}

export const useBookedSlots = (workshopId: string, type: string) => {
    return useQuery({
        queryKey: ["booked-slots", workshopId, type],
        queryFn: () => bookedSlots(workshopId, type)
    })
}

export const useBookSlot = (workshopId: string, type: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BookSlot) => bookSlot(data),
        // onMutate: async (newBooking) => {
        //     await queryClient.cancelQueries({ queryKey: ["booked-slots", workshopId, type] });
        //     const previousSlots = queryClient.getQueryData<{ bookings: BookSlot[] }>(["booked-slots", workshopId, type]);
        //     if (previousSlots) {
        //         queryClient.setQueryData(
        //             ["booked-slots", workshopId, type],
        //             {
        //                 ...previousSlots,
        //                 bookings: [...previousSlots.bookings, newBooking]
        //             }
        //         );
        //     }
        //     return { previousSlots }
        // },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["booked-slots", workshopId, type] })
        },
        onError: (error) => {
            console.error('Booking failed:', error);
        }
    })
}

export const useCancelSlot = (workshopId?: string, type?: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bookingId: string) => cancelSlot(bookingId),
        onMutate: async (bookingId) => {
            await queryClient.cancelQueries({ queryKey: ["booked-slots", workshopId, type] });
            const previousSlots = queryClient.getQueryData<{ bookings: BookSlot[] }>(["booked-slots", workshopId, type]);
            if (previousSlots?.bookings) {
                queryClient.setQueryData(
                    ["booked-slots", workshopId, type],
                    {
                        ...previousSlots,
                        bookings: previousSlots.bookings.filter(slot => slot.bookingId !== bookingId)
                    }
                );
            }

            return { previousSlots };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["use-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["workshopSlots", workshopId] });
        },
        onError: (_, _bookingId, context) => {
            if (context?.previousSlots) {
                queryClient.setQueryData(
                    ["booked-slots", workshopId, type],
                    context.previousSlots
                );
            }
        }
    })
}

export const useSaveSlotId = () => {
    return useMutation({
        mutationFn: (slotId: string) => saveSlotId(slotId)
    })
}

export const useIsSlotAvailable = (data: { date: Date; time: string, endTime: string }) => {
    return useQuery({
        queryKey: ["isSlotAvailable"],
        queryFn: () => isSlotAvailable(data)
    })
}

export const useAllUserBookings = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ["use-bookings"],
        queryFn: () => allUserBookings(page, limit)
    })
}

export const useAvailableDates = (workshopId: string, currentDate: Date, type: string) => {
    const currentDateString = format(currentDate, "yyyy-MM");
    const year = currentDateString.split("-")[0];
    const month = currentDateString.split("-")[1];
    return useQuery({
        queryKey: ["availableDates", workshopId, format(currentDate, "yyyy-MM"), type],
        queryFn: () => availableDates(workshopId, month, year, type)
    })
}

export const useCheckSlotAvailability = (slotId: string) => {
    return useQuery({
        queryKey: ["is-slot-available", slotId],
        queryFn: () => checkSlotAvailability(slotId),
        enabled: false,
    });
};