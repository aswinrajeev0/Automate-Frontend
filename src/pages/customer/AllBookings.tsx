import React, { useState } from 'react';
import { Header } from '../../components/customer/Header';
import { Footer } from '../../components/customer/Footer';
import { useAllUserBookings } from '../../hooks/customer/useSlotBooking';
import { ICustomerBooking } from '../../types/booking.type';
import BookingCard from '../../components/customer/slotBooking/BookingCard';
import { Pagination1 } from '../../components/admin/Pagination1';

const UserBookingsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1)
    
    // Increased limit to show more bookings per page
    const limit = 6

    const { data, isLoading, isError } = useAllUserBookings(currentPage, limit)
    const bookings = (data?.bookings || []) as ICustomerBooking[];
    const totalBookings = data?.totalBookings;
    const totalPages = Math.ceil(totalBookings / limit) || 1
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">Loading your bookings...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                Error loading your bookings
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="text-gray-600 mb-4">You don't have any bookings yet.</div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Book a Service
                    </button>
                </div>
            </div>
        );
    }

    // Group bookings into rows of 3
    const rows = [];
    for (let i = 0; i < bookings.length; i += 3) {
        const row = bookings.slice(i, i + 3);
        rows.push(row);
    }

    return (
        <>
            <Header />
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

                <div className="space-y-4">
                    {rows.map((row, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {row.map((booking) => (
                                <BookingCard key={booking.bookingId} booking={booking} />
                            ))}
                            {/* Add empty placeholders to maintain grid structure if row is not complete */}
                            {row.length < 3 && [...Array(3 - row.length)].map((_, i) => (
                                <div key={`empty-${i}`} className="hidden md:block"></div>
                            ))}
                        </div>
                    ))}
                </div>
                
                <div className="mt-8">
                    <Pagination1
                        currentPage={currentPage}
                        onPageNext={() => setCurrentPage(currentPage + 1)}
                        onPagePrev={() => setCurrentPage(currentPage - 1)}
                        totalPages={totalPages}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserBookingsPage;