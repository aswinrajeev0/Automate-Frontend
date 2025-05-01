import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../ui/Card";
import { AlertCircle, Filter, Heart, MapPin, Star } from "lucide-react";
import { IWorkshopWithRating } from "../../../types/workshop.type";
import { useFavoriteWorkshopIds, useHandelFavorite } from "../../../hooks/customer/useWorkshops";
import mechsPng from "../../../assets/mechs.jpg"

interface WorkshopDisplaySectionProps {
    filteredWorkshops: IWorkshopWithRating[];
    sortOption: string;
    locationFilter: string;
    searchQuery: string;
}

const WorkshopDisplaySection: React.FC<WorkshopDisplaySectionProps> = ({
    filteredWorkshops,
    sortOption,
    locationFilter,
    searchQuery
}) => {

    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    const { refetch } = useFavoriteWorkshopIds();

    useEffect(() => {
        refetch().then((response) => {
            setFavoriteIds(response.data?.favoriteWorkshopIds || [])
        })
    }, [])

    const handleFavorite = useHandelFavorite()

    const handleFavoriteStatus = async (workshopId: string, isFavorite: boolean) => {
        await handleFavorite.mutateAsync({ workshopId, status: !isFavorite })
        setFavoriteIds(prev => prev.includes(workshopId)
            ? prev.filter(id => id !== workshopId)
            : [...prev, workshopId]);
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                    Showing <span className="font-medium">{filteredWorkshops.length}</span> workshops
                </p>
                {filteredWorkshops.length > 0 && (
                    <div className="flex items-center gap-1">
                        <Filter size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-500">

                            {(locationFilter !== "all" || sortOption !== "none") ? ", " : ""}
                            {locationFilter !== "all" ? `Location: ${locationFilter}` : ""}
                            {(locationFilter !== "all") && sortOption !== "none" ? ", " : ""}
                            {sortOption !== "none" ? `Sorted by: ${sortOption.replace("-", " ")}` : ""}
                            {locationFilter === "all" && sortOption === "none" ? "No filters applied" : ""}
                        </span>
                    </div>
                )}
            </div>

            {filteredWorkshops.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No workshops found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        {searchQuery || locationFilter !== "all"
                            ? "No results match your search criteria. Try adjusting your filters."
                            : "There are no workshops available at the moment."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {filteredWorkshops.map((workshop) => {
                        const isFavorite = favoriteIds.includes(workshop.workshopId);
                        return (
                            <Card key={workshop.workshopId} className="overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="relative h-44">
                                    <img
                                        src={workshop.image || mechsPng}
                                        alt={workshop.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    // onError={handleImageError}
                                    />

                                    <button
                                        className="absolute top-2 left-2 bg-white/80 hover:bg-white p-1.5 rounded-full transition-colors"
                                        aria-label="Add to favorites"
                                    >
                                        <Heart
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleFavoriteStatus(workshop.workshopId, isFavorite)
                                            }}
                                            size={16}
                                            className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"}
                                        />
                                    </button>

                                    {workshop.averageRating !== undefined && workshop.averageRating !== null && (
                                        <div className="absolute bottom-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center">
                                            <Star size={14} className="mr-1 fill-white" />
                                            {workshop.averageRating.toFixed(1) || 0}
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{workshop.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <MapPin size={14} className="mr-1" />
                                        <span className="truncate">
                                            {workshop.streetAddress}, {workshop.city}
                                        </span>
                                    </div>
                                    {workshop.description ? (
                                        <p className="text-sm text-gray-600 line-clamp-2">{workshop.description}</p>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No description available</p>
                                    )}
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{workshop.country}</span>
                                        <a
                                            href={`/workshop-details/${workshop.workshopId}`}
                                            className="text-sm font-medium text-yellow-600 hover:text-yellow-700"
                                        >
                                            View Details
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default WorkshopDisplaySection