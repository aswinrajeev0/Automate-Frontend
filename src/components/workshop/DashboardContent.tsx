import { useState } from 'react';
import { CheckCircle, PersonStanding, IndianRupee, FormInputIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useDashboardData, useGetEarningsChartData, useGetGrowtChartData } from '../../hooks/workshop/useDashboard';

export default function WorkshopDashboard() {
    const [selectedGrowthTimeframe, setSelectedGrowthTimeframe] = useState('week');
    const [selectedEarningsTimeframe, setSelectedEarningsTimeframe] = useState('week');

    const { data } = useDashboardData();

    const totalCustomers = data?.dashboardData.totalCustomers as number
    const totalEarnings = data?.dashboardData.totalEarnings as number
    const totalBookings = data?.dashboardData.totalBookings as number
    const totalRequests = data?.dashboardData.totalRequests as number

    const { data: growthChartData } = useGetGrowtChartData(selectedGrowthTimeframe);
    const growthData = growthChartData?.growthData || [];

    const { data: earningsChartData } = useGetEarningsChartData(selectedEarningsTimeframe);
    const earningsData = earningsChartData?.earningsData || [];

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Workshop Dashboard</h1>
                        <p className="text-gray-600">Bookings and financial overview for your workshop</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Earnings Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Customers</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{totalCustomers ? totalCustomers : 0}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <PersonStanding className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{totalEarnings || 0}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <IndianRupee className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{totalBookings || 0}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <CheckCircle className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{totalRequests || 0}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <FormInputIcon className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Earnings Overview</h2>
                        <select
                            className="border border-gray-300 rounded-md text-sm px-2 py-1"
                            value={selectedEarningsTimeframe}
                            onChange={(e) => setSelectedEarningsTimeframe(e.target.value)}
                        >
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                width={500}
                                height={400}
                                data={earningsData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="earnings" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Growth Chart */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Growth Overview</h2>
                        <select
                            className="border border-gray-300 rounded-md text-sm px-2 py-1"
                            value={selectedGrowthTimeframe}
                            onChange={(e) => setSelectedGrowthTimeframe(e.target.value)}
                        >
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="requests" stroke="#82ca9d" name="Service Requests" />
                                <Line type="monotone" dataKey="bookings" stroke="#ffc658" name="Bookings" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}