import { Calendar, Map, Eye } from "lucide-react"
import type React from "react"
import type { IJobs } from "../../../types/requests"
import truncateText from "../../../utils/truncate"
import { useNavigate } from "react-router-dom"

interface RequestsCardsProps {
    requests: IJobs[]
}

const JobsCards: React.FC<RequestsCardsProps> = ({ requests }) => {
    const navigate = useNavigate()
    return (
        <div className="grid grid-cols-1 gap-4">
            {requests.map((request) => (
                <div key={request.requestId} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {request.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(`${request.createdAt}`).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <div className="text-xs text-gray-500">Request ID</div>
                            <div className="font-medium">{request.requestId}</div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500">Customer</div>
                            <div className="font-medium">{request.name}</div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500">Vehicle No.</div>
                            <div>{request.vehicleNo}</div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500">Location</div>
                            <div className="flex items-center gap-1">
                                <Map size={14} className="text-gray-400" />
                                {truncateText(request.location, 30)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <button onClick={() => navigate(`/workshop/pending-jobs/request-details/${request.requestId}`)} className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 text-sm">
                            <Eye size={16} />
                            View Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default JobsCards

