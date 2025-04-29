import { Route, Routes } from "react-router-dom";
import SignupPage from "../pages/customer/Signup";
import LoginPage from "../pages/customer/Login";
import LandingPage from "../pages/customer/LandingPage";
import ForgotPasswordPage from "../pages/customer/ForgetPassword";
import ResetPasswordPage from "../pages/customer/ResetPassword";
import UserProfile from "../pages/customer/UserProfile";
import Map from "../components/map/Map";
import WorkshopDetail from "../pages/customer/WorkshopDetails";
import ServicesPage from "../pages/customer/RequestService";
import ServiceSelectionPage from "../pages/customer/SeriviceSelection";
import SlotBookingPage from "../pages/customer/SlotBookingPage";
import CarLiftServiceForm from "../pages/customer/CarLiftRequestPage";
import MobileWorkshop from "../pages/customer/MobileWorkshop";
import CustomerProtected from "../utils/protected/UserProtected";
import WorkshopsPage from "../pages/customer/AllWorkshops";
import WalletPage from "../pages/customer/WalletPage";
import ServiceRequestDashboard from "../pages/customer/RequestsPage";
import UserBookingsPage from "../pages/customer/AllBookings";
import ChatInterface from "../pages/chat/ChatPage";
import FavoritesPage from "../pages/customer/FavoritesPage";

export const CustomerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<CustomerProtected><UserProfile /></CustomerProtected>} />
            <Route path="/map" element={<Map />} />
            <Route path="/workshops" element={<WorkshopsPage />} />
            <Route path="/workshop-details/:id" element={<WorkshopDetail />} />
            <Route path="/request-service/:workshopId" element={<CustomerProtected><ServicesPage /></CustomerProtected>} />
            <Route path="/request-service/service/:workshopId" element={<CustomerProtected><ServiceSelectionPage /></CustomerProtected>} />
            <Route path="/request-service/slot-booking/:workshopId" element={<CustomerProtected><SlotBookingPage /></CustomerProtected>} />
            <Route path="/request-service/car-lift/:workshopId" element={<CustomerProtected><CarLiftServiceForm /></CustomerProtected>} />
            <Route path="/request-service/mobile-workshop/:workshopId" element={<CustomerProtected><MobileWorkshop /></CustomerProtected>} />
            <Route path="/wallet" element={<CustomerProtected><WalletPage /></CustomerProtected>} />
            <Route path="/requests" element={<CustomerProtected><ServiceRequestDashboard /></CustomerProtected>} />
            <Route path="/bookings" element={<CustomerProtected><UserBookingsPage /></CustomerProtected>} />
            <Route path="/chat" element={<CustomerProtected><ChatInterface userType="customer" /></CustomerProtected>} />
            <Route path="/favorites" element={<CustomerProtected><FavoritesPage /></CustomerProtected>} />
        </Routes>
    )
}