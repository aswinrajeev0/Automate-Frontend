import React from "react";
import { useReportPageData } from "../../../hooks/admin/useRevenueReport";

const SummaryCards: React.FC = () => {

    const { data: pageData } = useReportPageData();
    const reportData = pageData?.reportData;


    const totalBookingRevenue = (reportData?.totalBookingRevenue || 0) as number;
    const totalRequestRevenue = (reportData?.totalRequestRevenue || 0) as number;
    const totalRevenue = (reportData?.totalRevenue || 0) as number;
    const totalGST = (reportData?.totalGST || 0) as number;
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#9b87f5] rounded-lg p-4 text-white">
                <h2 className="text-lg font-medium">Total Revenue</h2>
                <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#9b87f5] rounded-lg p-4 text-white">
                <h2 className="text-lg font-medium">Requests Reveue</h2>
                <p className="text-3xl font-bold">₹{totalRequestRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#9b87f5] rounded-lg p-4 text-white">
                <h2 className="text-lg font-medium">Booking Revenue</h2>
                <p className="text-3xl font-bold">₹{totalBookingRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-[#9b87f5] rounded-lg p-4 text-white">
                <h2 className="text-lg font-medium">Total GST</h2>
                <p className="text-3xl font-bold">₹{totalGST.toLocaleString()}</p>
            </div>
        </div>
    )
}

export default SummaryCards;