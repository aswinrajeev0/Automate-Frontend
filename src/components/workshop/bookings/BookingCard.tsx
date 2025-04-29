import React, { useState } from "react";
import { IBooking } from "../../../types/booking.type";
import { useCancelBooking, useChangeBookingStatus } from "../../../hooks/workshop/bookings/useBookings";
import { useToaster } from "../../../hooks/ui/useToaster";

const BookingCard: React.FC<{ booking: IBooking }> = ({
    booking
}) => {
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const { successToast, errorToast } = useToaster()

    const cancelBooking = useCancelBooking();
    const changeBookingStatus = useChangeBookingStatus();

    const handleCancel = async (bookingId: string) => {
        try {
            const response = await cancelBooking.mutateAsync(bookingId);
            successToast(response.message || "Status updated")
        } catch (error: any) {
            errorToast(error.message)
        }
    };

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            const response = await changeBookingStatus.mutateAsync({ bookingId, newStatus })
            successToast(response.message || "Status updated")
        } catch (error: any) {
            errorToast(error.message)
        }
        setIsStatusDropdownOpen(false);
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-purple-100 text-purple-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const statusOptions = ['pending', 'confirmed', 'in-progress', 'completed'];
    const isStatusCancelled = booking.status === 'cancelled';
    const isStatusCompleted = booking.status === 'completed';

    return (
        <div
            key={booking.bookingId}
            className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
            <div
                className="border-b border-gray-200 px-4 py-3 flex justify-between items-center bg-gray-50"
            >
                <div>
                    <div className="font-medium">ID #{booking.bookingId.toUpperCase()}</div>
                    <br />
                    <div className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()}</div>
                </div>

                {/* Status Badge/Dropdown */}
                {isStatusCancelled ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Cancelled
                    </span>
                ) : isStatusCompleted ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                    </span>
                ) : (
                    // Dropdown for all other statuses
                    <div className="relative">
                        <button
                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                            className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center ${getStatusBadgeClass(booking.status)}`}
                        >
                            <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        {isStatusDropdownOpen && (
                            <div className="absolute right-0 mt-1 z-10 w-40 bg-white rounded-md shadow-lg overflow-hidden">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(booking.bookingId, status)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${status === booking.status ? 'font-bold bg-gray-50' : ''
                                            }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div
                className="flex-1 px-4 py-3"
            >
                {/* Customer & Vehicle Info */}
                <div className="mb-3">
                    <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium">{booking.customer}</span>
                    </div>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">{booking.customerPhone}</span>
                    </div>
                </div>

                {/* Services & Price */}
                <div>
                    <div className="mb-2">
                        <span className="text-sm font-medium">Service type: </span>
                        <span className="font-bold text-green-600">{booking.type.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-extrabold text-blue-700">{`${booking.time} - ${booking.endTime}`}</span>
                        </div>
                        <div className="text-sm font-bold">₹{(booking?.amount || 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="flex space-x-2 ml-auto">
                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <button onClick={() => handleCancel(booking.bookingId)} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingCard;