import { ArrowRight, MapPin, MessageCircle, Wrench, Home } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/customer/Header"
import { Footer } from "../../components/customer/Footer"
import { IFeaturedWorkshop, useFeaturedWorkshopsQuery } from "../../hooks/customer/useFeaturedWorkshop";
import { getFeaturedWorkshops } from "../../services/customer/customerService";
import WorkshopCard from "../../components/customer/workshop/WorkshopCard";
import { useEffect, useRef, useState } from "react";
import MapModal from "../../components/map/Map";
import { useFavoriteWorkshopIds } from "../../hooks/customer/useWorkshops";
import banner from "../../assets/banner.png";
import mechs2 from "../../assets/mechs2.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function LandingPage() {
    const navigate = useNavigate();
    const mapModalButtonRef = useRef<HTMLButtonElement>(null);
    const {customer} = useSelector((state: RootState) => state.customer);

    const { data, isLoading, isError } = useFeaturedWorkshopsQuery(getFeaturedWorkshops);

    const workshops = (data?.workshops ?? []) as IFeaturedWorkshop[];

    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    const { refetch } = useFavoriteWorkshopIds(!!customer);

    useEffect(() => {
        if (customer) {
            refetch().then((response) => {
                setFavoriteIds(response.data?.favoriteWorkshopIds || []);
            });
        }
    }, [customer, refetch])

    const handleNearbyClick = () => {
        if (mapModalButtonRef.current) {
            mapModalButtonRef.current.click();
        }
    }
    const toggleFavorite = (workshopId: string) => {
        setFavoriteIds(prev => prev.includes(workshopId)
            ? prev.filter(id => id !== workshopId)
            : [...prev, workshopId]);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />

            <section className="relative">
                <img src={banner} alt="" />
            </section>

            {/* Navigation icons */}
            <section className="py-8 border-b">
                <div className="container mx-auto">
                    <div className="flex justify-center gap-4 md:gap-16">
                        <div className="flex flex-col items-center">
                            <div className="p-3 rounded-full bg-red-500 text-white mb-2">
                                <Home className="w-6 h-6" />
                            </div>
                            <span className="text-red-500 font-semibold">Home</span>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer">
                            <div onClick={() => navigate("/workshops")} className="p-3 rounded-full bg-gray-500 text-white mb-2">
                                <Wrench className="w-6 h-6" />
                            </div>
                            <span className="text-gray-500 font-semibold">Workshop</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div onClick={() => navigate("/workshops")} className="p-3 rounded-full bg-gray-500 text-white mb-2">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <span className="text-gray-500 font-semibold">Near Me</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div onClick={() => navigate("/chat")} className="p-3 rounded-full bg-gray-500 text-white mb-2">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <span className="text-gray-500 font-semibold">Chats</span>
                        </div>
                        {/* <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-gray-500 text-white mb-2">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-gray-500 font-semibold">About Us</span>
            </div> */}
                    </div>
                </div>
            </section>

            {/* Workshop cards */}
            {isLoading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading workshops...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-8">
                    <p className="text-red-400">Failed to load workshops.</p>
                </div>
            ) : workshops.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No workshops found.</p>
                </div>
            ) : (
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-8">Featured Workshops</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {workshops.map((workshop) => {
                                const isFavorite = favoriteIds.includes(workshop._id);
                                return (
                                    <WorkshopCard
                                        workshop={workshop} key={workshop._id}
                                        isFavorite={isFavorite}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                )
                            })}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => navigate("/workshops")} className="flex items-center text-black font-medium cursor-pointer">
                                See More <ArrowRight className="ml-1 h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>
            )}


            {/* Find Workshop Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="md:w-1/2">
                            <img
                                src={mechs2}
                                alt="Car service illustration"
                                className="w-full max-w-lg mx-auto"
                            />
                        </div>
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-3xl font-bold mb-6">Find your nearest workshop</h2>
                            <Button onClick={handleNearbyClick} className="bg-amber-400 hover:bg-amber-500 text-black font-bold px-8 py-6 rounded-full text-lg">
                                Find Now
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="hidden">
                <MapModal ref={mapModalButtonRef} />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
