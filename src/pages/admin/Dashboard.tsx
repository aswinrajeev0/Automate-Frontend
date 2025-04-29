import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Wrench, FileText, AlertTriangle, DollarSign, CheckCheckIcon } from "lucide-react";
import {
  SidebarProvider
} from "../../components/ui/Sidebar";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../store/slices/adminSlice";
import { useToaster } from "../../hooks/ui/useToaster";
import { useAdminLogout } from "../../hooks/admin/useAdminAuth";
import AdminHeader from "../../components/admin/AdminHeader";
import { useIsMobile } from "../../hooks/useMobile";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { successToast } = useToaster();
  const [isSideBarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const logOut = useAdminLogout();
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
      dispatch(adminLogout());
      successToast("You have been successfully logged out of admin panel");
      navigate("/admin/login");
    }
  };

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { id: "customers", title: "Customers", icon: Users, path: "/admin/customers" },
    { id: "workshops", title: "Workshops", icon: Wrench, path: "/admin/workshops" },
    { id: "requests", title: "Requests", icon: FileText, path: "/admin/requests" },
    { id: "bookings", title: "Bookings", icon: CheckCheckIcon, path: "/admin/bookings" },
    { id: "revenue", title: "Revenue Report", icon: DollarSign, path: "/admin/revenue-report" },
    { id: "approvals", title: "Pending Approvals", icon: AlertTriangle, path: "/admin/approvals" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar - Position fixed for desktop, and absolute for mobile */}
        <aside 
          className={`
            ${!isMobile ? "sticky top-0 h-screen" : "fixed top-0 left-0 h-screen"} 
            bg-[#9b87f5] z-50
            transition-all duration-300 ease-in-out
            overflow-hidden
            ${isMobile 
              ? isSideBarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64" 
              : isSideBarOpen ? "w-64" : "w-16"
            }
          `}
        >
          <div className="border-b border-white/10">
            <div className="flex items-center gap-2 px-4 py-4">
              <div className="bg-black rounded-full p-1">
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
                  className="text-purple-400"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              {(isSideBarOpen || isMobile) && (
                <span className="font-bold tracking-wide text-xl text-black">AUTOMATE</span>
              )}
            </div>
          </div>

          {/* Navigation Menu - Fixed height and no scroll */}
          <div className="h-[calc(100%-64px)]">
            <nav className="px-2 py-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <Link 
                      to={item.path} 
                      className="py-3 px-3 text-black hover:bg-white/10 flex items-center gap-2 rounded-md"
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
        </aside>

        {/* Overlay for mobile sidebar */}
        {isMobile && isSideBarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <AdminHeader
            isSidebarOpen={isSideBarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
          />
          <main className="p-4 md:p-6 bg-gray-50 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}