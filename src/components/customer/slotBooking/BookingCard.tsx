import React, { useState } from "react";
import { ICustomerBooking } from "../../../types/booking.type";
import { Calendar, User } from "lucide-react";
import CancelConfirmationModal from "./CancelModal";
import { useCancelSlot } from "../../../hooks/customer/useSlotBooking";
import { useToaster } from "../../../hooks/ui/useToaster";

const BookingCard: React.FC<{ booking: ICustomerBooking }> = ({ booking }) => {
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const { successToast, errorToast } = useToaster();
    const cancelBooking = useCancelSlot()
    const handleCancel = async () => {
        try {
            const response = await cancelBooking.mutateAsync(booking.bookingId)
            if (response.success) {
                successToast(response.message || "Booking Cancelled");
            } else {
                errorToast(response.message || "Error cancelling slot");
            }
        } catch (error: any) {
            errorToast(error?.message || "Error cancelling slot")
        }
    }

    const today = new Date();
    const bookingDate = new Date(booking.date);

    const displayStatus =
        (booking.status === 'confirmed' || booking.status === 'pending') &&
            today > bookingDate
            ? 'completed'
            : booking.status;

    const getStatusBadge = (status: ICustomerBooking['status']) => {
        switch (status) {
            case 'confirmed':
                return <span className="flex items-center text-white bg-green-500 px-3 py-1 rounded-full text-xs">✓ Confirmed</span>;
            case 'pending':
                return <span className="flex items-center text-black bg-yellow-300 px-3 py-1 rounded-full text-xs">⊘ Pending</span>;
            case 'cancelled':
                return <span className="flex items-center text-white bg-red-500 px-3 py-1 rounded-full text-xs">✕ Cancelled</span>;
            case 'completed':
                return <span className="flex items-center text-white bg-blue-500 px-3 py-1 rounded-full text-xs">✓ Completed</span>;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full">
            <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-yellow-500 font-semibold">{booking.type.toUpperCase()} Service</h3>
                        <p className="text-gray-700 text-sm">{booking.workshop}</p>
                    </div>
                    <div>
                        {getStatusBadge(displayStatus)}
                    </div>
                </div>

                <div className="flex items-start mb-3">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                        <p className="text-gray-500 text-xs">Date & Time</p>
                        <p className="font-medium text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                        <p className="font-medium text-sm">{booking.time} - {booking.endTime}</p>
                    </div>
                </div>

                <div className="flex items-start mb-3">
                    <User className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                        <p className="text-gray-500 text-xs">Service Provider</p>
                        <p className="font-medium text-sm">{booking.workshop}</p>
                    </div>
                </div>

                <div className="flex items-start mb-3">
                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-gray-400 flex-shrink-0">₹</div>
                    <div>
                        <p className="text-gray-500 text-xs">Price</p>
                        <p className="font-medium text-sm">₹{booking.price.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex items-start mb-3">
                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-gray-400 flex-shrink-0">₹</div>
                    <div>
                        <p className="text-gray-500 text-xs">GST</p>
                        <p className="font-medium text-sm">₹{booking.gst.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex items-start mb-3">
                    <div className="w-5 h-5 flex items-center justify-center mr-2 text-gray-400 flex-shrink-0">₹</div>
                    <div>
                        <p className="text-gray-500 text-xs">Final Amount</p>
                        <p className="font-medium text-sm">₹{booking.amount.toLocaleString()}</p>
                    </div>
                </div>

                <div className="mt-auto">
                    {displayStatus === 'pending' || displayStatus === 'confirmed' ? (
                        <button
                            onClick={() => setOpenCancelModal(true)}
                            className="w-full border border-red-500 bg-white text-red-500 rounded py-2 text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                            Cancel Booking
                        </button>
                    ) : null}
                </div>
            </div>

            <CancelConfirmationModal
                isOpen={openCancelModal}
                onConfirm={handleCancel}
                setIsOpen={setOpenCancelModal}
                id={booking.bookingId}
            />
        </div>
    );
};

export default BookingCard;