import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Car, Wrench, CreditCard, User, Phone } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequestDetails } from '../../../hooks/workshop/useWorkshopRequests';
import { IRequest } from '../../../types/requests';

const FinishedJobDetailsPage: React.FC = () => {
    const [requestStatus, setRequestStatus] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const { requestId } = useParams();

    const { data } = useRequestDetails(requestId as string);
    const requestDetails: IRequest = data?.request as IRequest;

    useEffect(() => {
        if (requestDetails?.status) {
            setRequestStatus(requestDetails.status);
        }
    }, [requestDetails]);

    const handleBack = () => {
        navigate(-1);
    };

    if (!requestDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "on_way": return "bg-blue-100 text-blue-800";
            case "in_progress": return "bg-yellow-100 text-yellow-800";
            case "completed": return "bg-green-100 text-green-800";
            case "delivered": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const formatStatus = (status: string) => {
        return status.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm min-h-screen">
            <div className="mb-6">
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    <span>Back to requests</span>
                </button>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Request Details</h1>
                        <p className="text-gray-600">Review service request information</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full ${getStatusBadgeColor(requestStatus || 'pending')}`}>
                        {formatStatus(requestStatus || 'pending')}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    <div className="space-y-6">
                        <div className="rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={requestDetails?.image || "/car-placeholder.jpg"}
                                alt="Vehicle"
                                className="w-full h-64 object-cover"
                            />
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="font-medium text-gray-800 mb-3">Customer Notes</h3>
                            <p className="text-gray-600 text-sm">{requestDetails?.notes || "No additional notes provided."}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <h3 className="font-medium text-gray-800 mb-4">Service Requirements</h3>
                            <div>
                                {requestDetails?.description}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <Calendar size={16} className="mr-2 text-gray-500" />
                                        <span>{new Date(requestDetails?.createdAt).toDateString()}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Name:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <User size={16} className="mr-2 text-gray-500" />
                                        <span>{requestDetails?.name}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mobile No:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <Phone size={16} className="mr-2 text-gray-500" />
                                        <span>{requestDetails?.mobile}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <MapPin size={16} className="mr-2 text-gray-500" />
                                        <span>{requestDetails?.location}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Model:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <Car size={16} className="mr-2 text-gray-500" />
                                        <span>{requestDetails?.carBrand}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Car Type:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <Car size={16} className="mr-2 text-gray-500" />
                                        <span>{requestDetails?.carType}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Service Type:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <Wrench size={16} className="mr-2 text-gray-500" />
                                        <span>{requestDetails?.type.toLocaleUpperCase()}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment Status:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <CreditCard size={16} className="mr-2 text-gray-500" />
                                        <span>{requestDetails?.paymentStatus.toUpperCase()}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Vehicle No:</h3>
                                    <div className="flex items-center text-gray-800">
                                        <Car size={16} className="mr-2 text-gray-500" />
                                        <span>{requestDetails?.vehicleNo}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinishedJobDetailsPage;