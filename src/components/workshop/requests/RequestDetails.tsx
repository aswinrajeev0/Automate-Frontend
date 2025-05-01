import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Car, Wrench, CreditCard, User, Phone } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcceptRequest, useRejectRequest, useRequestDetails } from '../../../hooks/workshop/useWorkshopRequests';
import { IRequest } from '../../../types/requests';
import { useToaster } from '../../../hooks/ui/useToaster';
import carPlaceHolderImage from "../../../assets/car-placeholder.jpg"

const RequestDetailsPage: React.FC = () => {
    const [_showConfirmation, setShowConfirmation] = useState(false);
    const [requestStatus, setRequestStatus] = useState<string | undefined>(undefined);
    const { successToast, errorToast } = useToaster();
    const navigate = useNavigate();

    const { requestId } = useParams();

    const { data } = useRequestDetails(requestId as string);
    const requestDetails: IRequest = data?.request as IRequest;

    useEffect(() => {
        if (requestDetails?.status) {
            setRequestStatus(requestDetails.status);
        }
    }, [requestDetails]);

    const acceptRequest = useAcceptRequest();
    const rejectRequest = useRejectRequest();

    const handleAccept = async () => {
        try {
            const response = await acceptRequest.mutateAsync(requestId as string);
            if (response.success) {
                setRequestStatus("accepted");
                setShowConfirmation(true);
                successToast(response?.message || "Updated successfully");

                // refetch();
            } else {
                errorToast(response.message || "Failed to update");
            }
        } catch (error) {
            errorToast("An error occurred while accepting the request");
        }
    };

    const handleReject = async () => {
        try {
            const response = await rejectRequest.mutateAsync(requestId as string);
            if (response.success) {
                setRequestStatus("rejected");
                successToast(response?.message || "Updated successfully");

                // refetch();
            } else {
                errorToast(response.message || "Failed to update");
            }
        } catch (error) {
            errorToast("An error occurred while rejecting the request");
        }
    };

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
                <h1 className="text-2xl font-bold text-gray-800">Request Details</h1>
                <p className="text-gray-600">Review service request information</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {/* Left Column - Car Image */}
                    <div className="space-y-6">
                        <div className="rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={requestDetails?.image || carPlaceHolderImage}
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

                    {/* Right Column - Details */}
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

                        <div className="flex gap-4">
                            {requestStatus === "accepted" ? (
                                <button
                                    disabled
                                    className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                >
                                    Accepted
                                </button>
                            ) : requestStatus === "rejected" ? (
                                <button
                                    disabled
                                    className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                >
                                    Rejected
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleAccept}
                                        disabled={acceptRequest.isPending}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-70"
                                    >
                                        {acceptRequest.isPending ? "Processing..." : "Accept"}
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={rejectRequest.isPending}
                                        className="flex-1 bg-white hover:bg-gray-50 text-red-600 border border-red-600 py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-70"
                                    >
                                        {rejectRequest.isPending ? "Processing..." : "Reject"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsPage;