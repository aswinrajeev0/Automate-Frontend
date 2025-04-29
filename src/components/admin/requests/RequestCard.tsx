import React from "react";
import { Card, CardContent } from "../../ui/Card";
import { Building, Calendar, Car, CreditCard, MapPin, User, Wrench } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { IAdminRequest } from "../../../types/requests";
import { Badge } from "../../ui/Badge";

const AdminRequestCard: React.FC<{request: IAdminRequest}> = ({ request }) => {

    const statusColors = {
        submitted: "bg-blue-100 text-blue-800",
        pending: "bg-yellow-100 text-yellow-800",
        on_way: "bg-purple-100 text-purple-800",
        in_progress: "bg-orange-100 text-orange-800",
        completed: "bg-green-100 text-green-800",
        delivered: "bg-emerald-100 text-emerald-800",
        accepted: "bg-teal-100 text-teal-800",
        rejected: "bg-red-100 text-red-800"
    };

    const paymentStatusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        completed: "bg-green-100 text-green-800"
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                {/* Header with Request ID and Status */}
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div>
                            <h3 className="font-bold text-lg">{request.requestId}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <Badge className={`ml-2 ${statusColors[request.status]}`}>
                            {request.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={`${paymentStatusColors[request.paymentStatus]}`}>
                            Payment: {request.paymentStatus}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                            {request.type === "car-lift" ? "Car Lift" : "Mobile Workshop"}
                        </Badge>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="p-4 grid grid-cols-12 gap-4">
                    {/* Customer Information */}
                    <div className="col-span-3">
                        <div className="flex items-start space-x-2">
                            <User className="h-5 w-5 text-blue-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-700">Customer</h4>
                                <p className="font-semibold">{request.customerId?.name}</p>
                                <p className="text-sm text-gray-600">{request.customerId?.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="col-span-3">
                        <div className="flex items-start space-x-2">
                            <Car className="h-5 w-5 text-green-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-700">Vehicle</h4>
                                <p className="font-semibold">{request.carBrand} {request.carType}</p>
                                <p className="text-sm text-gray-600">{request.vehicleNo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Workshop Information */}
                    <div className="col-span-3">
                        <div className="flex items-start space-x-2">
                            <Building className="h-5 w-5 text-purple-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-700">Workshop</h4>
                                <p className="font-semibold">{request.workshopId?.name}</p>
                                <p className="text-sm text-gray-600">{request.workshopId?.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="col-span-3">
                        <div className="flex items-start space-x-2">
                            <CreditCard className="h-5 w-5 text-amber-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-700">Payment</h4>
                                <p className="font-semibold">₹{(request.amount || 0).toLocaleString()}</p>
                                <p className="text-sm text-gray-600">
                                    GST: ₹{(request.gst || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Location and Description */}
                <div className="p-4 grid grid-cols-12 gap-4">
                    {/* Location */}
                    <div className="col-span-4">
                        <div className="flex items-start space-x-2">
                            <MapPin className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-700">Location</h4>
                                <p className="text-sm">{request.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="col-span-8">
                        <div className="flex items-start space-x-2">
                            <Wrench className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-700">Service Details</h4>
                                <p className="text-sm">{request.description || 'No description provided'}</p>
                                {request.notes && (
                                    <div className="mt-2 bg-amber-50 p-2 rounded text-sm border border-amber-200">
                                        <span className="font-medium">Note:</span> {request.notes}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminRequestCard