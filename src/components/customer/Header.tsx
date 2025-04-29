
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store/store"
import { User, Wallet, MessageSquare, ClipboardList, LogOut, CheckCheck, Heart } from "lucide-react"
import { customerLogout } from "../../store/slices/customerSlice"
import { useToaster } from "../../hooks/ui/useToaster"
import { useCustomerLogout } from "../../hooks/customer/useCustomerAuth"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export const Header = () => {
    const navigate = useNavigate()
    const { customer } = useSelector((state: RootState) => state.customer)
    const dispatch = useDispatch()
    const { successToast } = useToaster()
    const logout = useCustomerLogout()

    async function handleLogout() {
        const response = await logout.mutateAsync()
        if (response.success) {
            dispatch(customerLogout())
            successToast("Logged out successfully.")
            navigate("/login")
        }
    }

    const getInitials = () => {
        if (!customer || !customer.name) return "AU"
        return customer.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <header className="bg-yellow-300 p-4">
            <div className="container mx-auto flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                    <div onClick={() => navigate("/")} className="bg-black rounded-full p-3 mr-3">
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
                            className="text-amber-300"
                        >
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold uppercase tracking-wider">Automate</h1>
                </div>
                <div className="flex gap-4 items-center">
                    {customer ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                                <Avatar className="cursor-pointer border-2 border-black hover:opacity-90 transition-opacity">
                                    <AvatarImage src={customer.image} alt={customer.name || "User"} />
                                    <AvatarFallback className="bg-black text-amber-300 font-medium">{getInitials()}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/wallet")} className="cursor-pointer">
                                    <Wallet className="mr-2 h-4 w-4" />
                                    <span>Wallet</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/favorites")} className="cursor-pointer">
                                    <Heart className="mr-2 h-4 w-4" />
                                    <span>Favorites</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/chat")} className="cursor-pointer">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    <span>Chat</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/requests")} className="cursor-pointer">
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    <span>Requests</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/bookings")} className="cursor-pointer">
                                    <CheckCheck className="mr-2 h-4 w-4" />
                                    <span>Bookings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/login")}
                                className="text-black-400 px-4 py-2 rounded-md hover:text-black/50 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-black-400 px-4 py-2 rounded-md hover:text-black/50 transition-colors"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

