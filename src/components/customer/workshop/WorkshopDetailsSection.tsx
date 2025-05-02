import React, { useEffect, useState } from "react";
import { Button } from "../../ui/Button";
import { Heart, MessageCircle, Phone, MapPin, Clock, Calendar, Star, Info, ChevronDown, ChevronUp } from "lucide-react";
import { IWorkshop, useHandelFavorite, useIsFavorite } from "../../../hooks/customer/useWorkshops";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/Tooltip";
import { useNavigate } from "react-router-dom";
import { useToaster } from "../../../hooks/ui/useToaster";
import fallackImage from "../../../assets/mechs.jpg"
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

interface WorkshopDetailsSectionProps {
    workshop: IWorkshop
    reviewCount: number
}

const WorkshopDetailsSection: React.FC<WorkshopDetailsSectionProps> = ({ workshop, reviewCount }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { successToast, errorToast } = useToaster();

    const navigate = useNavigate()

    const { customer } = useSelector((state: RootState) => state.customer)

    const { refetch: refetchFavoriteStatus } = useIsFavorite(workshop.id, !!customer);

    useEffect(() => {
        if (customer) {
            refetchFavoriteStatus().then((res) => {
                setIsFavorite(res.data?.isFavorite || false);
            });
        }
    }, [workshop.id, customer])


    const handleFavoriteStatus = useHandelFavorite();

    const handleFavorite = async (workshopId: string) => {
        try {
            const response = await handleFavoriteStatus.mutateAsync({ workshopId, status: !isFavorite });
            if (response?.success) {
                setIsFavorite(!isFavorite);
                successToast(response?.message || "Update success")
            } else {
                errorToast(response.message || "Something went wrong")
            }
        } catch (error: any) {
            errorToast(error?.data?.message)
        }
    }

    const bioIsLong = workshop?.bio && workshop.bio.length > 150;
    const displayBio = bioIsLong && !expanded
        ? `${workshop?.bio?.substring(0, 150)}...`
        : workshop?.bio;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <div className="relative group overflow-hidden rounded-lg">
                        <img
                            src={workshop?.image ? workshop?.image : fallackImage}
                            alt={workshop?.name}
                            className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            style={{ maxHeight: '450px' }}
                        />
                        {/* {workshop?.featured && (
                            <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                                Featured Workshop
                            </Badge>
                        )} */}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock size={16} className="text-gray-500" />
                                <span className="text-sm font-medium">Working Hours</span>
                            </div>
                            <p className="text-sm text-gray-600">{"Mon-Fri: 9AM-6PM"}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <MapPin size={16} className="text-gray-500" />
                                <span className="text-sm font-medium">Location</span>
                            </div>
                            <p className="text-sm text-gray-600">{`${workshop?.country}, ${workshop?.state}` || "Downtown Area"}</p>
                            <p className="text-sm text-gray-600">{`${workshop?.city}` || "Downtown Area"}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-3xl font-bold">{workshop?.name}</h1>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={i < (workshop?.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                                />
                            ))}
                            <span className="ml-1 text-sm text-gray-600">({reviewCount || 0})</span>
                        </div>
                    </div>

                    <div className="flex-grow">
                        <div className="prose prose-sm max-w-none mb-2">
                            <p className="text-gray-700">{displayBio}</p>
                        </div>
                        {bioIsLong && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-blue-600 p-0 h-auto mb-6"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? (
                                    <>Show less <ChevronUp size={16} /></>
                                ) : (
                                    <>Read more <ChevronDown size={16} /></>
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="mt-auto">
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`flex items-center justify-center ${isFavorite ? 'bg-red-50' : ''}`}
                                            onClick={() => handleFavorite(workshop.id)}
                                        >
                                            <Heart
                                                size={18}
                                                className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => navigate(`/chat?workshopId=${workshop.id}`)}
                                            variant="outline" className="flex items-center justify-center">
                                            <MessageCircle size={18} className="text-gray-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Message workshop</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => window.location.href = `tel:${workshop.phone}`} variant="outline" className="flex items-center justify-center">
                                            <Phone size={18} className="text-gray-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Call workshop</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => navigate(`/request-service/service/${workshop.id}`)}
                                            variant="outline" className="flex items-center justify-center">
                                            <Calendar size={18} className="text-gray-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Schedule appointment</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <Button onClick={() => navigate(`/request-service/${workshop.id}`)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-white h-12 text-lg font-medium">
                            Request a service
                        </Button>

                        <div className="flex items-center justify-center gap-2 mt-3">
                            <Info size={14} className="text-gray-400" />
                            <p className="text-xs text-gray-500">Usually responds within 24 hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkshopDetailsSection