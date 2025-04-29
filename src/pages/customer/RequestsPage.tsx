import { useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '../../components/customer/Header';
import { Footer } from '../../components/customer/Footer';
import { useGetAllRequests } from '../../hooks/customer/useServiceRequests';
import { IUserRequestResponse } from '../../types/requests';
import RequestCard from '../../components/customer/requests/RequestCard';
import { Pagination1 } from '../../components/admin/Pagination1';

const ServiceRequestDashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');

    const limit = 10;

    const {data, isLoading, isError} = useGetAllRequests(currentPage, limit);

    const requests = (data?.requests || []) as IUserRequestResponse[];
    const totalPages = Math.ceil(data?.totalRequests/limit) || 1;
    
    // Filter requests based on search input
    const filteredRequests = requests.filter(request => {
        if (!filter) return true;
        
        const searchLower = filter.toLowerCase();
        return (
            request.type?.toLowerCase().includes(searchLower) ||
            request.workshop?.name?.toLowerCase().includes(searchLower) ||
            request.status?.toLowerCase().includes(searchLower) 
            // request.vehicleNo?.toLowerCase().includes(searchLower) ||
            // request.carBrand?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <>
        <Header />
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Service Requests</h1>

                    {/* Filters and search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by type, workshop, status, vehicle number..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Loading and error states */}
                    {isLoading && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Loading service requests...</p>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-8">
                            <p className="text-red-500">There was an error loading your service requests. Please try again later.</p>
                        </div>
                    )}

                    {/* No results message */}
                    {!isLoading && !isError && filteredRequests.length === 0 && (
                        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                            <p className="text-gray-500">No service requests found{filter ? " matching your search" : ""}.</p>
                        </div>
                    )}

                    {/* Request cards */}
                    <div className="space-y-6">
                        {filteredRequests.map((request) => (
                            <RequestCard key={request.requestId} request={request} />
                        ))}
                    </div>

                    {/* Pagination - only show if we have results */}
                    {filteredRequests.length > 0 && (
                        <div className="mt-6">
                            <Pagination1
                                currentPage={currentPage}
                                onPageNext={() => setCurrentPage(currentPage+1)}
                                onPagePrev={() => setCurrentPage(currentPage-1)}
                                totalPages={totalPages}
                            />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServiceRequestDashboard;