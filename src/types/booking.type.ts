export interface IBooking {
    customer: string;
    customerId: string;
    customerPhone: string;
    bookingId: string;
    price: string;
    gst: number;
    amount: number;
    time: string;
    type: string;
    endTime: string;
    date: Date;
    status: string;
}

export interface ICustomerBooking {
    customer: string;
    customerId: string;
    customerPhone: string;
    workshop: string;
    workshopId: string;
    workshopPhone: string;
    bookingId: string;
    price: string;
    gst: number;
    amount: number;
    time: string;
    type: string;
    endTime: string;
    date: Date;
    status: string;
}

//admin booking types

interface ICustomer {
    id: string;
    name: string;
    phone: string;
}

interface IWorkshop {
    id: string;
    name: string;
    phone: string;
    address?: string;
}

export interface IAdminBooking {
    id: string;
    bookingId: string;
    customerId: ICustomer;
    workshopId: IWorkshop;
    date: Date;
    time: string;
    type: string;
    endTime: string;
    duration: number;
    price: number;
    amount: number;
    gst?: number;
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
}