import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const LocationComponent: React.FC<{ handleLocationSelect: (address: string) => void }> = ({ handleLocationSelect }) => {
    const [location, setLocation] = useState<{ lat: number; lon: number }>({ lat: 0, lon: 0 });
    const [_error, setError] = useState<string | null>(null);
    const [locationString, setLocationString] = useState("");

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);


    useEffect(() => {
        if (!location.lat || !location.lon) return;

        const fetchLocation = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lon}`
                );
                const data = await response.json();
                setLocationString(data.display_name);
            } catch (err) {
                setError("Failed to fetch location.");
            }
        };

        fetchLocation();
    }, [location]);

    return (
        <>
            <div>
                <div className="flex items-center mb-4">
                    <MapPin size={24} className="text-red-500 mr-2" />
                    <div>
                        <p className="font-medium">Current Location</p>
                        <p className="text-gray-600">{locationString || "Fetching location"}</p>
                    </div>
                </div>
                <button
                    onClick={() => handleLocationSelect(locationString)}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Use Current Location
                </button>
            </div>

        </>
    );
};

export default LocationComponent;
