import React from "react";
import { IUserRequestResponse } from "../../../types/requests";
import { Calendar, CarFront, Check, Clock, Phone, Car, FileText, CreditCard, Info } from "lucide-react";

const RequestCard: React.FC<{ request: IUserRequestResponse }> = ({ request }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ready to pickup': return 'bg-blue-100 text-blue-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Pending': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div key={request.requestId} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
            {/* Header section with type, status and amount */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                    <div className="p-3 bg-gray-100 rounded-full mr-4">
                        <CarFront className="text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{request.type}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-3">{request.workshop.name}</span>
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(request.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                    <div className="text-right">
                        <div className="font-semibold text-lg">₹{(request.amount || 0).toLocaleString()}</div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                            {request.status === 'Ready to pickup' && <Clock className="h-3 w-3 inline mr-1" />}
                            {request.status === 'Delivered' && <Check className="h-3 w-3 inline mr-1" />}
                            {request.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Detailed information section */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Vehicle Information */}
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        Vehicle Information
                    </h4>
                    <div className="pl-6 space-y-1 text-sm">
                        <p className="text-gray-600">
                            <span className="font-medium">Vehicle #:</span> {request.vehicleNo}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Brand:</span> {request.carBrand}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Type:</span> {request.carType}
                        </p>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Information
                    </h4>
                    <div className="pl-6 space-y-1 text-sm">
                        <p className="text-gray-600">
                            <span className="font-medium">Name:</span> {request.name}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Mobile:</span> {request.mobile}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Location:</span> {request.location}
                        </p>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Details
                    </h4>
                    <div className="pl-6 space-y-1 text-sm">
                        <p className="text-gray-600">
                            <span className="font-medium">Amount:</span> ₹{(request.amount || 0).toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">GST:</span> ₹{(request.gst || 0).toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Total:</span> ₹{((request.amount || 0) + (request.gst || 0)).toLocaleString()}
                        </p>
                        {/* <p className="text-gray-600 flex items-center">
                            <span className="font-medium mr-1">Payment Status:</span> 
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentStatusColor(request.paymentStatus)}`}>
                                {request.paymentStatus}
                            </span>
                        </p> */}
                    </div>
                </div>
            </div>

            {/* Service Description and Notes */}
            {(request.description || request.notes) && (
                <div className="p-4 border-t border-gray-100">
                    <div className="space-y-3">
                        {request.description && (
                            <div>
                                <h4 className="font-medium text-gray-700 flex items-center mb-1">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Service Description
                                </h4>
                                <p className="pl-6 text-sm text-gray-600">{request.description}</p>
                            </div>
                        )}
                        
                        {request.notes && (
                            <div>
                                <h4 className="font-medium text-gray-700 flex items-center mb-1">
                                    <Info className="h-4 w-4 mr-2" />
                                    Additional Notes
                                </h4>
                                <p className="pl-6 text-sm text-gray-600">{request.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestCard;