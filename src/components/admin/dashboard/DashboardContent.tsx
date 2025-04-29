import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "../../ui/Card"
import { Tooltip } from "react-leaflet"
import { useState } from "react";
import { useCustomerGrowth, useDashboardData, useWorkshopGrowth } from "../../../hooks/admin/useDashboard";

function DashboardContent() {
    const [filter, setFilter] = useState("monthly");
    const [workshopFilter, setWorkshopFilter] = useState("monthly");

    const { data: customerGrowthData } = useCustomerGrowth(filter);
    const customerData = (customerGrowthData?.customerData || []) as { name: string; customers: number }[];

    const { data: workshopGrowthData } = useWorkshopGrowth(workshopFilter);
    const workshopData = (workshopGrowthData?.workshopData || []) as { name: string; workshops: number }[];

    const { data: dashboardDataResponse } = useDashboardData();
    const totalCustomers = dashboardDataResponse?.dashboardData.totalCustomers || 0;
    const totalWorkshops = dashboardDataResponse?.dashboardData.totalWorkshops || 0;
    const totalBookings = dashboardDataResponse?.dashboardData.totalBookings || 0;
    const totalRequests = dashboardDataResponse?.dashboardData.totalRequests || 0;
    const totalEarnings = dashboardDataResponse?.dashboardData.totalEarnings || 0;

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="bg-[#9b87f5] text-white border-none shadow-md">
                    <CardContent className="p-4 md:p-6">
                        <div className="space-y-1">
                            <p className="text-base md:text-lg font-medium">Total Revenue</p>
                            <p className="text-2xl md:text-3xl font-bold">₹{totalEarnings}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#9b87f5] text-white border-none shadow-md">
                    <CardContent className="p-4 md:p-6">
                        <div className="space-y-1">
                            <p className="text-base md:text-lg font-medium">No. of Customers</p>
                            <p className="text-2xl md:text-3xl font-bold">{totalCustomers}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#9b87f5] text-white border-none shadow-md">
                    <CardContent className="p-4 md:p-6">
                        <div className="space-y-1">
                            <p className="text-base md:text-lg font-medium">No. of Workshops</p>
                            <p className="text-2xl md:text-3xl font-bold">{totalWorkshops}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#9b87f5] text-white border-none shadow-md">
                    <CardContent className="p-4 md:p-6">
                        <div className="space-y-1">
                            <p className="text-base md:text-lg font-medium">Total Requests</p>
                            <p className="text-2xl md:text-3xl font-bold">{totalRequests}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#9b87f5] text-white border-none shadow-md">
                    <CardContent className="p-4 md:p-6">
                        <div className="space-y-1">
                            <p className="text-base md:text-lg font-medium">Total Bookings</p>
                            <p className="text-2xl md:text-3xl font-bold">{totalBookings}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional content would go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-bold">Customer Growth</h2>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="p-2 border rounded-md bg-white text-sm"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="h-60 md:h-80 bg-muted/20 rounded-md flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={customerData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="customers" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-bold">Workshop Growth</h2>
                            <select
                                value={workshopFilter}
                                onChange={(e) => setWorkshopFilter(e.target.value)}
                                className="p-2 border rounded-md bg-white text-sm"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="h-60 md:h-80 bg-muted/20 rounded-md flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={workshopData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="workshops" stroke="#de4618" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardContent

