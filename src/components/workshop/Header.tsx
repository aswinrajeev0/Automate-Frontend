import React from "react"
import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

interface WorkshopHeaderProps {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isSidebarOpen: boolean;
    handleLogout: () => Promise<void>
}

const WorkshopHeader: React.FC<WorkshopHeaderProps> = ({ setIsSidebarOpen, isSidebarOpen, handleLogout }) => {

    const { workshop } = useSelector((state: RootState) => state.workshop)

    const getInitials = () => {
        if (!workshop || !workshop.name) return "AW"
        return workshop.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <header className="bg-[#181616] text-white px-4 md:px-6 py-3 sticky top-0 z-20 w-full">
            <div className="flex h-12 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white hover:bg-white/10 rounded-md p-1"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold hidden md:block">Workshop Dashboard</h1>
                </div>
                <div className="flex items-center gap-3">
                    {/* <Button size="icon" variant="ghost" className="relative text-white hover:bg-white/10">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-[10px] font-medium text-white flex items-center justify-center">
                            3
                        </span>
                    </Button> */}
                    <div className="flex items-center gap-2">
                        <Avatar className="cursor-pointer border-2 border-black hover:opacity-90 transition-opacity">
                            <AvatarImage src={workshop?.image} alt={workshop?.name || "Workshop"} />
                            <AvatarFallback className="bg-black text-amber-300 font-medium">{getInitials()}</AvatarFallback>
                        </Avatar>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="hidden md:flex text-white hover:bg-white/10"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="md:hidden text-white hover:bg-white/10">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default WorkshopHeader;