import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, LogOut, Clock, CheckCircle, MessageSquare, Star, UserCircle, Grid2x2 } from "lucide-react";
import {
    SidebarProvider
} from "../../components/ui/Sidebar";
import { useDispatch } from "react-redux";
import { useToaster } from "../../hooks/ui/useToaster";
import WorkshopHeader from "../../components/workshop/Header";
import { useIsMobile } from "../../hooks/useMobile";
import { workshopLogout } from "../../store/slices/workshopSlice";
import { useWorkshopLogout } from "../../hooks/workshop/useWorkshopAuth";

export default function WorkshopDashboard() {
    const navigate = useNavigate();
    const { successToast } = useToaster();
    const [isSideBarOpen, setIsSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    const logOut = useWorkshopLogout();
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    }, [isMobile]);

    const handleLogout = async () => {
        const response = await logOut.mutateAsync();
        if (response) {
            dispatch(workshopLogout());
            successToast("You have been successfully logged out of workshop");
            navigate("/workshop/login");
        }
    };

    const menuItems = [
        { id: "dashboard", title: "Dashboard", icon: LayoutDashboard, path: "/workshop" },
        { id: "requests", title: "Requests", icon: FileText, path: "/workshop/requests" },
        { id: "pending-jobs", title: "Pending Jobs", icon: Clock, path: "/workshop/pending-jobs" },
        { id: "finished-jobs", title: "Finished Jobs", icon: CheckCircle, path: "/workshop/finished-jobs" },
        { id: "slots", title: "Slots", icon: Grid2x2 , path: "/workshop/slots" },
        { id: "bookings", title: "Bookings", icon: CheckCircle, path: "/workshop/bookings" },
        { id: "chats", title: "Chats", icon: MessageSquare, path: "/workshop/chats" },
        { id: "ratings", title: "Ratings and review", icon: Star, path: "/workshop/ratings" },
        { id: "profile", title: "Edit Profile", icon: UserCircle, path: "/workshop/profile" },
    ];

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background overflow-hidden">
                <aside
                    className={`
                fixed top-0 left-0 h-full bg-[#181616] z-50 overflow-y-auto
                flex flex-col
                transition-all duration-300 ease-in-out
                ${isMobile
                            ? isSideBarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
                            : isSideBarOpen ? "w-64" : "w-16"
                        }
                ${!isMobile ? "static" : ""}
              `}
                >
                    {/* Header */}
                    <div className="border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-2 px-4 py-4">
                            <div className="bg-white rounded-full p-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-red-400"
                                >
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                            </div>
                            {(isSideBarOpen || isMobile) && (
                                <span className="font-bold tracking-wide text-xl text-white">AUTOMATE</span>
                            )}
                        </div>
                    </div>

                    {/* Content - flex-grow to push logout to bottom */}
                    <div className="px-2 py-4 flex-grow">
                        <nav>
                            <ul className="space-y-1">
                                {menuItems.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            to={item.path}
                                            className="py-3 px-3 text-white hover:bg-white/10 flex items-center gap-2 rounded-md"
                                            onClick={() => isMobile && setIsSidebarOpen(false)}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {(isSideBarOpen || isMobile) && <span className="text-base">{item.title}</span>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/10 p-4 shrink-0">
                        <button
                            onClick={handleLogout}
                            className="py-3 w-full px-3 text-white hover:bg-white/10 flex items-center gap-2 rounded-md"
                        >
                            <LogOut className="h-5 w-5" />
                            {(isSideBarOpen || isMobile) && <span className="text-base">Logout</span>}
                        </button>
                    </div>
                </aside>

                {/* Overlay for mobile when sidebar is open */}
                {isMobile && isSideBarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content - Now with flex-col and overflow handling */}
                <div
                    className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${isSideBarOpen && !isMobile ? "ml-0" : isMobile ? "ml-0" : "ml-0"
                        }`}
                >
                    <WorkshopHeader
                        isSidebarOpen={isSideBarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        handleLogout={handleLogout}
                        // className="shrink-0"
                    />
                    <main className="p-4 md:p-6 bg-gray-50 flex-1 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}