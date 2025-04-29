import React, { useState, useEffect } from "react";

interface ReverseGeocodeProps {
    lat: number;
    lon: number;
}

const ReverseGeocode: React.FC<ReverseGeocodeProps> = ({ lat, lon }) => {
    const [location, setLocation] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lat || !lon) return;

        const fetchLocation = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );
                const data = await response.json();
                setLocation(data.display_name);
            } catch (err) {
                setError("Failed to fetch location.");
            }
        };

        fetchLocation();
    }, [lat, lon]);

    return (
        <div>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <p className="font-medium">Current Location</p>
                    <p className="text-gray-600">{location || "Fetching location"}</p>
                </>
            )}
        </div>
    );
};

export default ReverseGeocode;
