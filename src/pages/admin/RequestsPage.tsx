import React, { useState } from 'react';
import {
  Card,
  CardContent
} from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Search, AlertCircle } from 'lucide-react';
import { useAllRequests } from '../../hooks/admin/useRequests';
import AdminRequestCard from '../../components/admin/requests/RequestCard';
import { IAdminRequest } from '../../types/requests';
import { Pagination1 } from '../../components/admin/Pagination1';

const RequestsAdminHorizontalCards: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const limit = 5;

  const { data } = useAllRequests(currentPage, limit, searchTerm);
  const requests = (data?.requests || []) as IAdminRequest[];
  const totalRequests = data?.totalRequests;
  const totalPages = Math.ceil(totalRequests / limit) || 1
  console.log(data)

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="text-gray-500">View all customer service requests</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by ID, vehicle number..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <h2 className="text-lg font-medium">
            Showing {limit} of {totalRequests} total requests
          </h2>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center py-6">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No requests found</h3>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <AdminRequestCard key={request.requestId} request={request} />
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
    </>
  );
};

export default RequestsAdminHorizontalCards;