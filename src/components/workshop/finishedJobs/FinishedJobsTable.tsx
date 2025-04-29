import { Calendar, Map, Eye } from "lucide-react"
import type React from "react"
import type { IJobs } from "../../../types/requests"
import truncateText from "../../../utils/truncate"
import { useNavigate } from "react-router-dom"

interface FinishedJobsTableProps {
    requests: IJobs[]
}

const FinishedJobsTable: React.FC<FinishedJobsTableProps> = ({ requests }) => {

    const navigate = useNavigate()

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Request ID
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer Name
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicle No.
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request, index) => (
                        <tr key={request.requestId} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    {new Date(request.date).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{request.requestId}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{request.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{request.vehicleNo}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-800">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {request.type}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Map size={16} className="text-gray-400" />
                                    {truncateText(request.location, 30)}
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => navigate(`/workshop/finished-jobs/request-details/${request.requestId}`)} className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1">
                                    <Eye size={16} />
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default FinishedJobsTable
