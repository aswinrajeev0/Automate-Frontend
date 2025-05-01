"use client"

import type React from "react"
import { useState, useEffect, useCallback, forwardRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L, { type LatLngExpression } from "leaflet"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"
import "leaflet-geosearch/dist/geosearch.css"
import { Button } from "../ui/Button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "../ui/Dialog";
import { Loader2, MapPin, Car } from "lucide-react";
import axios from "axios";
import markerPng from "../../assets/marker.png";
import workshopMarkerPng from "../../assets/workshop-marker-2.png";
import currentLocationMarkerPng from "../../assets/current-location.png";

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    // iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconRetinaUrl: markerPng,
    iconUrl: markerPng,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Custom icons
const userIcon = new L.Icon({
    iconUrl: markerPng,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "user-marker",
})

const workshopIcon = new L.Icon({
    iconUrl: workshopMarkerPng,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "workshop-marker",
})

const currentLocationIcon = new L.Icon({
    iconUrl: currentLocationMarkerPng,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: "current-marker",
})

// Workshop type
interface Workshop {
    id: string
    lat: number
    lng: number
    name: string
    address?: string
    distance?: number
}

// Component to handle map events
const MapEvents: React.FC<{ setMarkedPosition: (pos: [number, number]) => void }> = ({ setMarkedPosition }) => {
    useMapEvents({
        click(e) {
            setMarkedPosition([e.latlng.lat, e.latlng.lng])
        },
    })
    return null
}

// Search control component
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

const fetchNearbyWorkshops = async (lat: number, lng: number, radius = 5000): Promise<Workshop[]> => {
    try {
        const query = `
      [out:json];
      (
        node["shop"="car_repair"](around:${radius},${lat},${lng});
        node["amenity"="car_repair"](around:${radius},${lat},${lng});
        node["service"="vehicle_repair"](around:${radius},${lat},${lng});
        way["shop"="car_repair"](around:${radius},${lat},${lng});
        way["amenity"="car_repair"](around:${radius},${lat},${lng});
        way["service"="vehicle_repair"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `

        const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
        const data = response.data

        console.log(data)

        const workshops: Workshop[] = []

        if (data && data.elements) {
            data.elements.forEach((element: any) => {
                if (element.type === "node" && element.lat && element.lon) {
                    const distance = calculateDistance(lat, lng, element.lat, element.lon)

                    workshops.push({
                        id: element.id.toString(),
                        lat: element.lat,
                        lng: element.lon,
                        name: element.tags?.name || "Unnamed Workshop",
                        address: element.tags?.address || element.tags?.["addr:street"] || "",
                        distance: distance,
                    })
                }
            })
        }

        return workshops.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    } catch (error) {
        console.error("Error fetching nearby workshops:", error)
        return []
    }
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return Number.parseFloat(d.toFixed(2))
}

const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
}

// Use forwardRef to expose the button ref to parent components
const MapModal = forwardRef<HTMLButtonElement, {}>((_, ref) => {
    const [open, setOpen] = useState(false)
    const [initialPosition, setInitialPosition] = useState<LatLngExpression>([9.936434, 76.318366])
    const [markedPosition, setMarkedPosition] = useState<[number, number] | null>(null)
    const [workshops, setWorkshops] = useState<Workshop[]>([])
    const [loading, setLoading] = useState(false)
    const [searchRadius, setSearchRadius] = useState(5000) // 5km default radius
    const [_userLocationAvailable, setUserLocationAvailable] = useState(false)
    const [currentLocation, setCurrentLocation] = useState<[number, number]>([0,0])

    const fetchWorkshopsNearLocation = useCallback(
        async (lat: number, lng: number) => {
            setLoading(true)
            try {
                const nearbyWorkshops = await fetchNearbyWorkshops(lat, lng, searchRadius)
                setWorkshops(nearbyWorkshops)
            } catch (error) {
                console.error("Error fetching workshops:", error)
            } finally {
                setLoading(false)
            }
        },
        [searchRadius],
    )

    // Get user's current location when modal opens
    useEffect(() => {
        let isMounted = true // Add a flag to track component mount status

        if (open) {
            if (navigator.geolocation) {
                setLoading(true)
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if (isMounted) {
                            const userPosition: [number, number] = [position.coords.latitude, position.coords.longitude]
                            setInitialPosition(userPosition)
                            setMarkedPosition(userPosition)
                            setUserLocationAvailable(true)

                            // Fetch workshops near user location
                            fetchWorkshopsNearLocation(userPosition[0], userPosition[1])
                            setCurrentLocation([userPosition[0], userPosition[1]])
                        }
                    },
                    (error) => {
                        if (isMounted) {
                            console.error("Error getting location:", error)
                            setLoading(false)
                            setUserLocationAvailable(false)
                        }
                    },
                )
            } else {
                setUserLocationAvailable(false)
                setLoading(false)
            }
        }

        return () => {
            isMounted = false
        }
    }, [open, fetchWorkshopsNearLocation])

    useEffect(() => {
        if (markedPosition) {
            fetchWorkshopsNearLocation(markedPosition[0], markedPosition[1])
        }
    }, [markedPosition, searchRadius, fetchWorkshopsNearLocation])

    const handleSelectWorkshop = (workshop: Workshop) => {
        console.log("Selected workshop:", workshop)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button ref={ref} variant="outline" className="flex items-center gap-2">
                    <MapPin size={16} />
                    Find Nearby Workshops
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        Find Nearby Workshops
                    </DialogTitle>
                    <DialogDescription>
                        Click on the map to set your location or use the search bar to find workshops near you.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 pt-4 h-[70vh]">
                    <div className="md:col-span-2 h-full rounded-md overflow-hidden border">
                        {loading && (
                            <div className="absolute inset-0 bg-black/10 z-[1000] flex items-center justify-center rounded-md">
                                <div className="bg-white p-4 rounded-md shadow-lg flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Loading map data...</span>
                                </div>
                            </div>
                        )}

                        <MapContainer center={initialPosition} zoom={13} style={{ height: "100%", width: "100%" }} className="z-0">
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

                                    {/* Show search radius */}
                                    <Circle
                                        center={markedPosition}
                                        radius={searchRadius}
                                        pathOptions={{
                                            fillColor: "blue",
                                            fillOpacity: 0.1,
                                            color: "blue",
                                            weight: 1,
                                        }}
                                    />
                                </>
                            )}

                            {workshops.map((workshop) => (
                                <Marker key={workshop.id} position={[workshop.lat, workshop.lng]} icon={workshopIcon}>
                                    <Popup>
                                        <div className="text-sm">
                                            <strong>{workshop.name}</strong>
                                            <br />
                                            {workshop.address && (
                                                <>
                                                    {workshop.address}
                                                    <br />
                                                </>
                                            )}
                                            <span className="text-xs text-gray-500">{workshop.distance} km away</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            <MapEvents setMarkedPosition={setMarkedPosition} />
                            <SearchControl />
                        </MapContainer>
                    </div>

                    <div className="h-full overflow-y-auto border rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Nearby Workshops</h3>
                            <div className="text-sm text-gray-500">{workshops.length} found</div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                <span>Searching for workshops...</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {workshops.length > 0 ? (
                                    workshops.map((workshop) => (
                                        <div
                                            key={workshop.id}
                                            className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => handleSelectWorkshop(workshop)}
                                        >
                                            <div className="font-medium">{workshop.name}</div>
                                            {workshop.address && <div className="text-sm text-gray-500 mt-1">{workshop.address}</div>}
                                            <div className="text-xs text-gray-400 mt-1">{workshop.distance} km away</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No workshops found in this area.
                                        <br />
                                        Try adjusting your location or increasing the search radius.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <div className="flex items-center gap-2 mr-auto">
                        <span className="text-sm text-gray-500">Search radius:</span>
                        <select
                            value={searchRadius}
                            onChange={(e) => setSearchRadius(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value={1000}>1 km</option>
                            <option value={2000}>2 km</option>
                            <option value={5000}>5 km</option>
                            <option value={10000}>10 km</option>
                            <option value={20000}>20 km</option>
                        </select>
                    </div>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})

// Add display name for better debugging
MapModal.displayName = "MapModal"

export default MapModal