import React, { useState } from 'react';
import SlotCreationForm from '../../components/workshop/slots/SlotCreationForm';
import SlotList from '../../components/workshop/slots/SlotsList';

const WorkshopSlotManagement: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const convertTimeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Workshop Slot Management</h1>

            {/* Create Slots Form */}
            <SlotCreationForm
                loading={loading}
                setLoading={setLoading}
                convertTimeToMinutes={convertTimeToMinutes}
            />

            {/* Slots List */}
            <SlotList
                convertTimeToMinutes={convertTimeToMinutes}
                loading={loading}
            />
        </div>
    );
};

export default WorkshopSlotManagement;