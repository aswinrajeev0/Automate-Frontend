import { Heart } from "lucide-react";
import { Card, CardContent } from "../../ui/Card";
import { Pagination1 } from "../../admin/Pagination1";
import { useState } from "react";
import { useToaster } from "../../../hooks/ui/useToaster";
import { useNavigate } from "react-router-dom";
import { useFavorites, useHandelFavorite } from "../../../hooks/customer/useWorkshops";
import { IFavoriteWorkshops } from "../../../types/workshop.type";
import mechsPng from "../../../assets/mechs.jpg"

const FavoriteWorkshopCards: React.FC = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const { successToast, errorToast } = useToaster();
    const navigate = useNavigate();
    const limit = 8;

    const { data: favoritesData } = useFavorites(currentPage, limit);
    const favorites = (favoritesData?.workshops || []) as IFavoriteWorkshops[];
    const totalPages = Math.ceil(favoritesData?.total / limit) || 1;

    const handleFavoriteStatus = useHandelFavorite(currentPage, limit);

    const handleRemoveFavorite = async (workshopId: string) => {
        try {
            const response = await handleFavoriteStatus.mutateAsync({ workshopId, status: false });
            if (response?.success) {
                successToast(response?.message || "Update success")
            } else {
                errorToast(response.message || "Something went wrong")
            }
        } catch (error: any) {
            errorToast(error?.data?.message)
        }
    };

    const handleExploreWorkshops = () => {
        navigate('/workshops');
    };

    return (
        <>
            {favorites.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favorites.map(workshop => (
                            <Card key={workshop.workshopId} onClick={() => navigate(`/workshop-details/${workshop.workshopId}`)} className="overflow-hidden border-none shadow-lg rounded-lg cursor-pointer">
                                <div className="relative h-48">
                                    <img
                                        src={workshop.image ? workshop.image : mechsPng}
                                        alt={workshop.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="bg-amber-300 p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold">{workshop.name}</h3>
                                            <p className="text-sm">{workshop.city}</p>
                                        </div>
                                        <Heart
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFavorite(workshop.workshopId);
                                            }}
                                            size={18}
                                            className="text-red-500 fill-red-500"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Pagination1
                        currentPage={currentPage}
                        onPageNext={() => setCurrentPage(currentPage + 1)}
                        onPagePrev={() => setCurrentPage(currentPage - 1)}
                        totalPages={totalPages}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-gray-100 rounded-full p-6 mb-6">
                        <Heart size={64} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Favorites Yet</h2>
                    <p className="text-gray-600 max-w-md mb-8">
                        You haven't added any workshops to your favorites list. Explore workshops and add them to your favorites!
                    </p>
                    <button
                        onClick={handleExploreWorkshops}
                        className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Explore Workshops
                    </button>
                </div>
            )}
        </>
    )
}

export default FavoriteWorkshopCards;