import { useState } from 'react';
import { useAdminBookings } from '../../hooks/admin/useBookings';
import { Pagination1 } from '../../components/admin/Pagination1';
import { IAdminBooking } from '../../types/booking.type';
import BookingCards from '../../components/admin/bookings/BookingCard';

const WorkshopBookingsList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<string>("");

    const limit = 5
    const { data } = useAdminBookings(currentPage, limit, filter);
    const bookings = (data?.bookings || []) as IAdminBooking[];
    const totalBookings = data?.totalBookings
    const totalPages = Math.ceil(totalBookings/limit) || 1

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Workshop Bookings</h1>

            {/* Filters */}
            <div className="mb-6">
                <label htmlFor="status-filter" className="font-medium mr-2">Filter by status:</label>
                <select
                    id="status-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Bookings List */}
            <div className="grid grid-cols-1 gap-6">
                {bookings.length > 0 ? (
                    <BookingCards bookings={bookings} />
                ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600">No bookings found matching the selected filter.</p>
                    </div>
                )}
                <Pagination1
                    currentPage={currentPage}
                    onPageNext={() => setCurrentPage(currentPage + 1)}
                    onPagePrev={() => setCurrentPage(currentPage - 1)}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
};

export default WorkshopBookingsList;