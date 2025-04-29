import React, { useEffect, useState } from "react";
import { usePdfDownload, useReportBookings, useReportRequests } from "../../../hooks/admin/useRevenueReport";
import SummaryCards from "./SummaryCards";
import { Download } from "lucide-react";
import { Pagination1 } from "../Pagination1";
import { useToaster } from "../../../hooks/ui/useToaster";

interface Booking {
    bookingId: string;
    customerId: {
        name: string;
        _id: string
    };
    customerName?: string;
    workshopId: {
        name: string;
        _id: string
    };
    workshopName?: string;
    date: Date;
    time: string;
    type: string;
    endTime: string;
    duration: number;
    price: number;
    amount: number;
    status: string;
    gst: number;
    slotId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Request {
    requestId: string;
    name: string;
    mobile: string;
    vehicleNo: string;
    carType: string;
    carBrand: string;
    location: string;
    image: string;
    workshopId: {
        name: string;
        _id: string
    };
    workshopName?: string;
    customerId: {
        name: string;
        _id: string
    };
    type: string;
    status: string;
    paymentStatus: string;
    amount: number;
    gst: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReportPageContent: React.FC = () => {

    const [currentView, setCurrentView] = useState<'requests' | 'bookings'>('requests');
    const [dateRange, setDateRange] = useState<'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { errorToast, successToast } = useToaster();

    const limit = 10;

    const { data: reportRequestsResponse } = useReportRequests({ startDate, endDate, page: currentPage, limit })
    const requests = (reportRequestsResponse?.requests || []) as Request[]
    const totalRequests = reportRequestsResponse?.totalRequests || 0

    const { data: reportBookingsResponse } = useReportBookings({ startDate, endDate, page: currentPage, limit })
    const bookings = (reportBookingsResponse?.bookings || []) as Booking[]
    // const totalBookings = reportBookingsResponse?.totalBookings || 0

    const totalPages = Math.ceil(totalRequests / limit) || 1;

    const pdfDownload = usePdfDownload()

    const handleDownloadPDF = async () => {
        const serviceType = currentView as string;
        try {
            await pdfDownload.mutateAsync({ startDate, endDate, serviceType });
            successToast("Report downloaded")
        } catch (error) {
            errorToast("Error downloading report")
        }
    }

    useEffect(() => {
        const today = new Date();
        let start: Date | null = null;
        let end: Date | null = null;

        if (dateRange !== 'custom') {
            switch (dateRange) {
                case 'weekly':
                    start = new Date(today);
                    start.setDate(today.getDate() - 7);
                    end = new Date();
                    break;
                case 'monthly':
                    start = new Date(today);
                    start.setMonth(today.getMonth() - 1);
                    end = new Date();
                    break;
                case 'yearly':
                    start = new Date(today);
                    start.setFullYear(today.getFullYear() - 1);
                    end = new Date();
                    break;
            }

            if (start && end) {
                setStartDate(start);
                setEndDate(end);
            }
        }
    }, [dateRange]);

    return (
        <div className="max-w-full mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Revenue Report</h1>

            {/* Summary Cards */}
            <SummaryCards />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">

                <div className="flex items-center gap-2">
                    <span>From</span>
                    <input
                        type="date"
                        placeholder={(startDate as Date).toISOString().split("T")[0]}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                        value={(startDate as Date).toISOString().split("T")[0]}
                        onChange={(e) => {
                            setStartDate(new Date(e.target.value))
                            setDateRange("custom")
                        }}
                    />
                    <span>To</span>
                    <input
                        type="date"
                        placeholder={(endDate as Date).toISOString().split("T")[0]}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                        value={(endDate as Date).toISOString().split("T")[0]}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>

                <div className="ml-auto">
                    <button
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={handleDownloadPDF}
                    >
                        <Download size={16} />
                        <span>Download Report</span>
                    </button>
                </div>
            </div>

            {/* Date Range Options */}
            <div className="flex gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-md ${dateRange === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setDateRange('weekly')}
                >
                    Weekly
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${dateRange === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setDateRange('monthly')}
                >
                    Monthly
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${dateRange === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setDateRange('yearly')}
                >
                    Yearly
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${dateRange === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setDateRange('custom')}
                >
                    Custom
                </button>
            </div>

            {/* View Toggle */}
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    className={`px-4 py-2 ${currentView === 'requests' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setCurrentView('requests')}
                >
                    Requests
                </button>
                <button
                    className={`px-4 py-2 ${currentView === 'bookings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setCurrentView('bookings')}
                >
                    Bookings
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-gray-100 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                {currentView === 'requests' ? 'RequestId' : 'BookingId'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Workshop
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                GST
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentView === 'requests' ? (
                            requests.map((request, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {request.requestId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {request.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {request.workshopId.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{((request.amount || 0) - (request.gst || 0)).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{(request.gst || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{(request.amount || 0).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            bookings.map((booking, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {booking.bookingId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.customerId.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.workshopId.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{booking.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{booking.gst.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{booking.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {currentView === 'requests' && (
                <Pagination1
                    currentPage={currentPage}
                    onPageNext={() => setCurrentPage(currentPage + 1)}
                    onPagePrev={() => setCurrentPage(currentPage - 1)}
                    totalPages={totalPages}
                />
            )}
        </div>
    )
}

export default ReportPageContent