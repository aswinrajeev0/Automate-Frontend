import React from "react";
import { Card, CardContent } from "../../ui/Card";
import { IFeaturedWorkshop } from "../../../hooks/customer/useFeaturedWorkshop";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHandelFavorite } from "../../../hooks/customer/useWorkshops";

interface WorkshopCardProps {
    workshop: IFeaturedWorkshop;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, isFavorite, onToggleFavorite }) => {

    const handleFavorite = useHandelFavorite();

    const handleFavoriteStatus = async (workshopId: string) => {
        await handleFavorite.mutateAsync({workshopId, status: !isFavorite})
        onToggleFavorite(workshopId);
    }

    const navigate = useNavigate()

    return (
        <Card key={workshop.workshopId} onClick={() => navigate(`/workshop-details/${workshop._id}`)} className="overflow-hidden border-none shadow-lg rounded-lg cursor-pointer">
            <div className="relative h-48">
                <img
                    src={workshop.image ? workshop.image : "./mechs.jpg"}
                    alt={workshop.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <CardContent className="bg-amber-300 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold">{workshop.name}</h3>
                        <p className="text-sm">{workshop.state}</p>
                        <p className="text-sm">{workshop.city}</p>
                    </div>
                    <Heart
                        onClick={(e) => {
                            e.stopPropagation()
                            handleFavoriteStatus(workshop._id)
                        }}
                        className={isFavorite ? "text-red-600 fill-red-600" : "text-black-400 hover:text-red-500"}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default WorkshopCard