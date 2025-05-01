export interface IMessageType {
    _id: string;
    content: string;
    sender: "customer" | "workshop";
    timestamp: string;
    status: "sent" | "delivered" | "read";
    imageUrl: string | null;
}

export interface IConversationType {
    _id: string;
    customerId: {
        _id: string;
        image: string;
    };
    customerName: string;
    workshopId: {
        _id: string;
        image: string;
    };
    workshopName: string;
    latestMessage: {
        content: string;
        timestamp: Date;
        sender: string;
        status: string;
    };
    unreadCount: number;
}

export interface IFallbackUser {
    _id: string;
    name: string;
}