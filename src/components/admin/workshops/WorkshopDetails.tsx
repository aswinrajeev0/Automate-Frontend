import React from "react";
import { Badge } from "../../ui/Badge";
import { IWorkshop } from "./Workshops";

interface WorkshopDetailsProps {
    viewDetails: IWorkshop;
}

const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ viewDetails }) => {
    return (
        <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">ID</div>
                <div className="col-span-2">#{viewDetails.workshopId}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">Workshop Name</div>
                <div className="col-span-2">{viewDetails.name}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">Email</div>
                <div className="col-span-2">{viewDetails.email}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">Phone</div>
                <div className="col-span-2">{viewDetails.phone}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">Country</div>
                <div className="col-span-2">{viewDetails.country}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">State</div>
                <div className="col-span-2">{viewDetails.state}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">City</div>
                <div className="col-span-2">{viewDetails.city}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">Street Address</div>
                <div className="col-span-2">{viewDetails.streetAddress}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">Building No.</div>
                <div className="col-span-2">{viewDetails.buildingNo}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">Status</div>
                <div className="col-span-2">
                    <Badge
                        variant={
                            viewDetails.approvalStatus === "pending"
                                ? "secondary"
                                : viewDetails.approvalStatus === "rejected"
                                    ? "destructive"
                                    : "default"
                        }
                    >
                        {viewDetails.approvalStatus}
                    </Badge>
                </div>
            </div>
            {viewDetails.rejectionReason &&
                (
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                        <div className="font-medium">Reason for rejection</div>
                        <div className="col-span-2">{viewDetails.rejectionReason}</div>
                    </div>
                )
            }
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
                <div className="font-medium">Applied Date</div>
                <div className="col-span-2">{new Date(viewDetails.createdAt).toLocaleString()}</div>
            </div>
        </div>
    )
}

export default WorkshopDetails