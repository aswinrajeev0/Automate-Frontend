import { CalendarDays, Clock, Plus } from "lucide-react";
import React, { useState } from "react";
import { IFormData, ITimeSlot, ServiceTypeInfo } from "../../../types/slots";
import { useCreateSlots } from "../../../hooks/workshop/slots/useSlots.";
import { useToaster } from "../../../hooks/ui/useToaster";

interface SlotCreationFormProps {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    convertTimeToMinutes: (time: string) => number;

}

const SlotCreationForm: React.FC<SlotCreationFormProps> = ({loading, setLoading, convertTimeToMinutes}) => {
    const [formData, setFormData] = useState<IFormData>({
        date: '',
        openingTime: '09:00',
        closingTime: '17:00',
        serviceType: 'basic',
    });

    const {errorToast, successToast} = useToaster()

    const createSlots = useCreateSlots()

    const serviceTypes: Record<string, ServiceTypeInfo> = {
        basic: { name: "Basic", duration: 60 },
        interim: { name: "Interim", duration: 120 },
        full: { name: "Full", duration: 180 }
    };

    const convertMinutesToTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseInt(value, 10) : value;

        setFormData({
            ...formData,
            [name]: val
        } as IFormData);
    };

    const generateTimeSlots = (): ITimeSlot[] => {
        const { openingTime, closingTime, serviceType } = formData;

        const startMinutes = convertTimeToMinutes(openingTime);
        const endMinutes = convertTimeToMinutes(closingTime);
        const slotDuration = serviceTypes[serviceType].duration;

        const slots: ITimeSlot[] = [];
        for (let time = startMinutes; time <= endMinutes - slotDuration; time += slotDuration) {
            const startTime = convertMinutesToTime(time);
            const endTime = convertMinutesToTime(time + slotDuration);
            slots.push({ startTime, endTime });
        }

        return slots;
    };

    const handleGenerateSlots = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const timeSlots = generateTimeSlots();

        if (timeSlots.length === 0) {
            errorToast('No valid slots can be created with the selected time range and service type');
            return;
        }

        const slotsToCreate = timeSlots.map(slot => ({
            date: formData.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            serviceType: formData.serviceType,
            isAvailable: true,
            isBooked: false
        }));

        setLoading(true);
        try {
            const response = await createSlots.mutateAsync(slotsToCreate)
            if (response.success) {
                successToast(response.message || "Slots created")
            } else {
                errorToast(response.message || "Something went wrong")
            }
        } catch (err) {
            errorToast('Failed to create slots');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Generate New Slots</h2>
                <form onSubmit={handleGenerateSlots}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Date</label>
                            <div className="flex items-center">
                                <CalendarDays className="mr-2 text-gray-500" size={18} />
                                <input
                                    type="date"
                                    name="date"
                                    min={new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                    max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Service Type</label>
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="basic">Basic (1 hour)</option>
                                <option value="interim">Interim (2 hours)</option>
                                <option value="full">Full (3 hours)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Opening Time</label>
                            <div className="flex items-center">
                                <Clock className="mr-2 text-gray-500" size={18} />
                                <input
                                    type="time"
                                    name="openingTime"
                                    value={formData.openingTime}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Closing Time</label>
                            <div className="flex items-center">
                                <Clock className="mr-2 text-gray-500" size={18} />
                                <input
                                    type="time"
                                    name="closingTime"
                                    value={formData.closingTime}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 shadow-sm transition-colors"
                        >
                            <Plus size={18} className="mr-2" />
                            Generate Slots
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SlotCreationForm