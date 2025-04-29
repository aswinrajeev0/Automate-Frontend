import { Route, Routes } from "react-router-dom";
import WorkshopSignupPage from "../pages/workshop/WorkshopSignup";
import WorkshopLoginPage from "../pages/workshop/WorkshopLogin";
import WorkshopDashboard from "../pages/workshop/WorkshopDashboard";
import { WorkshopProtected } from "../utils/protected/WorkshopProtected";
import WokshopForgotPasswordPage from "../pages/workshop/WorkshopForgetPassword";
import WorkshopResetPasswordPage from "../pages/workshop/WorkshopResetPassword";
import WorkshopDasboardContent from "../components/workshop/DashboardContent";
import RequestsPage from "../pages/workshop/Requests";
import RequestDetailsPage from "../components/workshop/requests/RequestDetails";
import PendingJobspage from "../pages/workshop/PendingJobs";
import JobDetailsPage from "../components/workshop/pendingJobs/JobDetails";
import WorkshopReviews from "../pages/workshop/ReviewPage";
import WorkshopProfilePage from "../pages/workshop/WorkshopProfile";
import FinishedJobspage from "../pages/workshop/FinishedJobs";
import FinishedJobDetailsPage from "../components/workshop/finishedJobs/FinishedJobDetails";
import WorkshopBookings from "../pages/workshop/Bookings";
import WorkshopSlotManagement from "../pages/workshop/SlotManagement";
import ChatInterface from "../pages/chat/ChatPage";

export const WorkshopRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<WorkshopProtected><WorkshopDashboard /></WorkshopProtected>}>
                <Route index element={<WorkshopProtected><WorkshopDasboardContent /></WorkshopProtected>} />
                <Route path="requests" element={<RequestsPage />} />
                <Route path="pending-jobs" element={<PendingJobspage />} />
                <Route path="finished-jobs" element={<FinishedJobspage />} />
                <Route path="slots" element={<WorkshopSlotManagement />} />
                <Route path="bookings" element={<WorkshopBookings />} />
                <Route path="chats" element={<ChatInterface userType="workshop" />} />
                <Route path="ratings" element={<WorkshopReviews />} />
                <Route path="profile" element={<WorkshopProfilePage />} />
                <Route path="requests/request-details/:requestId" element={<RequestDetailsPage />} />
                <Route path="pending-jobs/request-details/:requestId" element={<JobDetailsPage />} />
                <Route path="finished-jobs/request-details/:requestId" element={<FinishedJobDetailsPage />} />
            </Route>
            <Route path="/login" element={<WorkshopLoginPage />} />
            <Route path="/signup" element={<WorkshopSignupPage />} />
            <Route path="/forgot-password" element={<WokshopForgotPasswordPage />} />
            <Route path="/reset-password" element={<WorkshopResetPasswordPage />} />
        </Routes>
    )
}