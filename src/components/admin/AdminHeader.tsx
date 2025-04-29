import React from "react";
import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/Button";

interface AdminHeaderProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  handleLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ setIsSidebarOpen, isSidebarOpen, handleLogout }) => {
  return (
    <header className="bg-[#9b87f5] text-white px-4 md:px-6 py-3 sticky top-0 z-20 w-full">
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
          <h1 className="text-lg font-semibold hidden md:block">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button size="icon" variant="ghost" className="relative text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button> */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-medium">A</span>
            </div>
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
};

export default AdminHeader;