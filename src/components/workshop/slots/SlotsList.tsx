import { Save, Trash2 } from "lucide-react";
import React from "react";
import { useAllSlots, useDeleteSlot, useToggleAvailableSlots } from "../../../hooks/workshop/slots/useSlots.";
import { useToaster } from "../../../hooks/ui/useToaster";
import { WorkshopSlot } from "../../../types/slots";

interface SlotListProps {
    convertTimeToMinutes: (time: string) => number
    loading: boolean;
}

const SlotList: React.FC<SlotListProps> = ({ convertTimeToMinutes, loading }) => {

    const { successToast, errorToast } = useToaster();

    const { data } = useAllSlots();
    const workshopSlots = (data?.slots || []) as WorkshopSlot[]
    const deleteSlot = useDeleteSlot();
    const toggleAvailability = useToggleAvailableSlots()

    const handleDeleteSlot = async (slotId: string): Promise<void> => {
        try {
            const response = await deleteSlot.mutateAsync(slotId);
            if (response.success) {
                successToast(response.message || "Slot deleted")
            } else {
                errorToast(response.message || "Something went wrong")
            }
        } catch (err) {
            errorToast('Failed to delete slot');
        }
    };

    const handleToggleAvailability = async (slotId: string, isAvailable: boolean): Promise<void> => {
        try {
            const response = await toggleAvailability.mutateAsync({ slotId, isAvailable });
            if (response.success) {
                successToast(response.message)
            } else {
                errorToast(response.message)
            }
        } catch (err) {
            errorToast('Failed to update slot');
        }
    };

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDuration = (startTime: string, endTime: string): string => {
        const start = convertTimeToMinutes(startTime);
        const end = convertTimeToMinutes(endTime);
        const durationMinutes = end - start;

        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        if (hours === 0) return `${minutes} min`;
        if (minutes === 0) return `${hours} hr`;
        return `${hours} hr ${minutes} min`;
    };

    const getServiceTypeName = (type: string): string => {
        const serviceTypeMappings: Record<string, string> = {
            basic: "Basic",
            interim: "Interim",
            full: "Full",
            minor: "Basic",
            major: "Full"
        };

        return serviceTypeMappings[type] || type;
    };

    return (
        <>
            <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Workshop Slots</h2>

                {loading ? (
                    <div className="text-gray-500 flex items-center justify-center p-8">
                        <svg className="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading slots...
                    </div>
                ) : workshopSlots.length === 0 ? (
                    <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                        <p>No slots available for this workshop.</p>
                        <p className="mt-2 text-sm">Generate slots using the form above.</p>
                    </div>
                ) : (
                    <div>
                        {/* Group slots by date */}
                        {Object.entries(
                            workshopSlots.reduce<Record<string, WorkshopSlot[]>>((acc, slot) => {
                                if (!acc[slot.date]) acc[slot.date] = [];
                                acc[slot.date].push(slot);
                                return acc;
                            }, {})
                        ).map(([date, dateSlots]) => (
                            <div key={date} className="mb-6">
                                <h3 className="font-medium text-lg mb-2 text-gray-700">{formatDate(date)}</h3>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {dateSlots.map((slot) => (
                                                    <tr key={slot._id} className="hover:bg-gray-50">
                                                        <td className="py-3 px-4 text-sm text-gray-900">{slot.startTime} - {slot.endTime}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-900">{formatDuration(slot.startTime, slot.endTime)}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-900 capitalize">{getServiceTypeName(slot.serviceType)}</td>
                                                        <td className="py-3 px-4 text-sm">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${slot.isAvailable
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                    }`}
                                                            >
                                                                {slot.isAvailable ? 'Available' : 'Unavailable'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-right space-x-2">
                                                            <button
                                                                disabled={slot.isBooked}
                                                                onClick={() => handleToggleAvailability(slot._id, slot.isAvailable)}
                                                                className="inline-flex items-center px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                                title={slot.isBooked ? undefined : (slot.isAvailable ? "Mark as unavailable" : "Mark as available")}
                                                            >
                                                                <Save size={16} className={slot.isBooked ? "opacity-40" : "opacity-100 transition-opacity"} />
                                                            </button>
                                                            <button
                                                                disabled={slot.isBooked}
                                                                onClick={() => handleDeleteSlot(slot._id)}
                                                                className="inline-flex items-center px-2 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                                title={slot.isBooked ? undefined : "Delete slot"}
                                                            >
                                                                <Trash2 size={16} className={slot.isBooked ? "opacity-40" : "opacity-100 transition-opacity"} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default SlotList