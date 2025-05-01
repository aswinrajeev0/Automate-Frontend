import L, { LatLngExpression } from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import currentLocationPng1 from "../../../assets/current-location1.png";
import markerPng from "../../../assets/marker.png";

interface MapSelectionProps {
    handleLocationSelect: (address: string) => void
}
delete (L.Icon.Default.prototype as any)._getIconUrl
const currentLocationIcon = new L.Icon({
    iconUrl: currentLocationPng1,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "current-marker",
})

const userIcon = new L.Icon({
    iconUrl: markerPng,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "user-marker",
})
const MapSelection: React.FC<MapSelectionProps> = ({ handleLocationSelect }) => {

    const [initialPosition] = useState<LatLngExpression>([9.936434, 76.318366])
    const [currentLocation, setCurrentLocation] = useState<[number, number]>([0, 0])
    const [_error, setError] = useState<string | null>(null);
    const [markedPosition, setMarkedPosition] = useState<[number, number] | null>(null)
    const [locationString, setLocationString] = useState<string>("")

    // useMapEvents({
    //     click(e) {
    //         setMarkedPosition([e.latlng.lat, e.latlng.lng])
    //     },
    // })

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation([
                        position.coords.latitude,
                        position.coords.longitude,
                    ]);
                    setMarkedPosition([
                        position.coords.latitude,
                        position.coords.longitude
                    ])
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
        if (!markedPosition || !markedPosition[0] || !markedPosition[1]) return;

        const lat = markedPosition[0]
        const lon = markedPosition[1]

        const fetchLocation = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );
                const data = await response.json();
                setLocationString(data.display_name);
            } catch (err) {
                setError("Failed to fetch location.");
            }
        };

        fetchLocation();
    }, [markedPosition]);

    return (
        <div>
            <div className="p-1" >
                <div>
                    <div className="text-center h-100">
                        <MapContainer center={initialPosition} zoom={13} style={{ height: "100%", width: "100%", borderRadius: 5 }} className="z-0">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {currentLocation && (
                                <Marker position={currentLocation} icon={currentLocationIcon}>
                                    <Popup>
                                        <strong>Your are here</strong>
                                    </Popup>
                                </Marker>
                            )}

                            {markedPosition && (
                                <>
                                    <Marker position={markedPosition} icon={userIcon}>
                                        <Popup>
                                            <strong>Selected Location</strong>
                                            <br />
                                            Lat: {markedPosition[0].toFixed(6)}
                                            <br />
                                            Lng: {markedPosition[1].toFixed(6)}
                                        </Popup>
                                    </Marker>

                                </>
                            )}

                            <MapEvents setMarkedPosition={setMarkedPosition} />
                            <SearchControl />
                        </MapContainer>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                {locationString ? (
                    <>
                        <p className="font-medium">Selected Location</p>
                        <p className="text-gray-600">{locationString}</p>
                    </>
                ): (
                    <p className="font-medium">Please select a place on the map</p>
                )}
            </div>

            <button
                onClick={() => handleLocationSelect(locationString)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Confirm Location
            </button>
        </div>
    )
}

export default MapSelection

const MapEvents: React.FC<{ setMarkedPosition: (pos: [number, number]) => void }> = ({ setMarkedPosition }) => {
    useMapEvents({
        click(e) {
            setMarkedPosition([e.latlng.lat, e.latlng.lng])
        },
    })
    return null
}

const SearchControl: React.FC = () => {
    const map = useMapEvents({})

    useEffect(() => {
        const provider = new OpenStreetMapProvider()
        const searchControl = GeoSearchControl({
            provider,
            style: "bar",
            showMarker: true,
            marker: { icon: userIcon },
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            searchLabel: "Search for location",
            keepResult: true,
        })

        map.addControl(searchControl)
        return () => {
            map.removeControl(searchControl)
        }
    }, [map])

    return null
}