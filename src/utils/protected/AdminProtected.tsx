import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Navigate } from "react-router-dom";

interface AdminProtectedProps {
    children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({children}) => {
    const {admin} = useSelector((state: RootState) => state.admin)
    if(!admin) {
        return <Navigate to={'/admin/login'} />
    }
    return <>{children}</>
}

export default AdminProtected