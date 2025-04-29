export interface ICarLiftdata {
    name: string;
    mobile: string;
    vehicleNo: string;
    carType: string;
    carBrand: string;
    location: string;
    image: string;
    workshopId: string;
    lat?: number;
    lon?: number;
    type: string;
}

export interface IMobileWorkshop {
    name: string;
    mobile: string;
    vehicleNo: string;
    carType: string;
    carBrand: string;
    location: string;
    description: string;
    notes?: string;
    workshopId: string;
    lat?: number;
    lon?: number;
    type: string;
}

export interface IAllPendingRequests {
    name: string;
    date: Date;
    location: string;
    requestId: string;
    vehicleNo: string;
    type: string;
    createdAt: Date;
}

export interface IRequest {
    status: string;
    name: string;
    requestId: string;
    location: string;
    vehicleNo: string;
    mobile: string;
    date: Date;
    type: string;
    paymentStatus: string;
    description?: string;
    notes?: string;
    image?: string;
    createdAt: string;
    carType: string;
    carBrand: string;
}

export interface IJobs {
    name: string;
    date: string;
    location: string;
    requestId: string;
    vehicleNo: string;
    type: string;
    createdAt?: Date;
}

export interface IUserRequestResponse {
    status: string;
    name: string;
    requestId: string;
    date: Date;
    type: string;
    workshop: {
        name: string
    }
    amount: number;
    carBrand: string,
    carType: string,
    gst: number,
    location: string,
    vehicleNo: string,
    description: string,
    image: string;
    notes: string;
    mobile: string;
}

interface ICustomer {
    _id: string;
    name: string;
    phone: string;
  }
  
  interface IWorkshop {
    _id: string;
    name: string;
    phone: string;
  }
  
  export interface IAdminRequest {
    id: string;
    requestId: string;
    name: string;
    mobile: string;
    vehicleNo: string;
    carType: string;
    carBrand: string;
    location: string;
    type: "car-lift" | "mobile-workshop";
    status: "submitted" | "pending" | "on_way" | "in_progress" | "completed" | "delivered" | "accepted" | "rejected";
    paymentStatus: "pending" | "completed";
    workshopId: IWorkshop;
    customerId: ICustomer;
    image?: string;
    amount: number;
    gst: number;
    description?: string;
    notes?: string;
    createdAt: Date;
    updatesAt: Date;
  }