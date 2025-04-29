import React, { useCallback, useEffect, useState } from 'react';
import { useGetAllWorkshopBookings } from '../../hooks/workshop/bookings/useBookings';
import { IBooking } from '../../types/booking.type';
import { Pagination1 } from '../../components/admin/Pagination1';
import BookingCard from '../../components/workshop/bookings/BookingCard';
import { debounce } from 'lodash';

const WorkshopBookings: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
    const limit = 6;

    const debounceSearch = useCallback(
        debounce((query) => setDebouncedSearch(query), 300),
        [],
    )

    const { data } = useGetAllWorkshopBookings(currentPage, limit, debouncedSearch, statusFilter);
    const bookings = (data?.bookings || []) as IBooking[];
    console.log(data)
    const totalPages = Math.ceil(data?.totalBookings/limit) || 1;

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    useEffect(() => {
        debounceSearch(searchTerm)
        return () => debounceSearch.cancel()
    }, [searchTerm, debounceSearch])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Workshop Bookings</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage all workshop appointments and service bookings
                    </p>
                </div>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Search by customer, vehicle, booking ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Status
                        </label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Bookings</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Bookings Display */}
                {bookings.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">No bookings found</p>
                        <p className="text-sm">Try adjusting your filters or search criteria</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {bookings.map((booking) => (
                            <BookingCard booking={booking} />
                        ))}
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

export default WorkshopBookings;