import React from "react";
import { IAdminBooking } from "../../../types/booking.type";
import { AlertTriangle, Calendar, Check, Clock, IndianRupee, Phone, Tag, User, X } from "lucide-react";

const BookingCards: React.FC<{ bookings: IAdminBooking[] }> = ({ bookings }) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "in-progress":
                return "bg-purple-100 text-purple-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <AlertTriangle className="h-4 w-4" />;
            case "confirmed":
                return <Check className="h-4 w-4" />;
            case "in-progress":
                return <Clock className="h-4 w-4" />;
            case "completed":
                return <Check className="h-4 w-4" />;
            case "cancelled":
                return <X className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        bookings.map(booking => {

            return (
                <div key={booking.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">{booking.type}</h2>
                            <p className="text-gray-600">Booking ID: {booking.bookingId.toUpperCase()}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium mb-2 text-gray-700">Customer</h3>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span>{booking.customerId.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{booking.customerId.phone}</span>
                                </div>
                            </div>

                        </div>

                        {/* Workshop Info */}
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium mb-2 text-gray-700">Workshop</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span>{booking.workshopId.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span>{booking.workshopId.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-1 text-gray-500 mb-1">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">Date</span>
                            </div>
                            <p>{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-gray-500 mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Time</span>
                            </div>
                            <p>{booking.time} - {booking.endTime}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-gray-500 mb-1">
                                <Tag className="h-4 w-4" />
                                <span className="text-sm">Duration</span>
                            </div>
                            <p>{booking.duration} hour(s)</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-gray-500 mb-1">
                                <IndianRupee className="h-4 w-4" />
                                <span className="text-sm">Price</span>
                            </div>
                            <p>₹{booking.amount.toFixed(2)}</p>
                            {booking.gst && <p className="text-xs text-gray-500">Incl. GST: ₹{booking.gst.toFixed(2)}</p>}
                        </div>
                    </div>

                </div>
            );
        })
    )
}

export default BookingCards