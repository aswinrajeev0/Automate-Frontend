import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerRoutes } from "./routes/CustomerRoute";
import { AdminRoutes } from "./routes/AdminRoute";
import { WorkshopRoutes } from "./routes/WorkshopRoute";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./utils/ScrollToTop";
function App() {

  return (
    <BrowserRouter>
      <Toaster />
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/workshop/*" element={<WorkshopRoutes />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
