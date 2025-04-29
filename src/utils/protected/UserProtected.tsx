import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Navigate } from "react-router-dom";

interface CustomerProtectedProps {
    children: React.ReactNode;
}

const CustomerProtected: React.FC<CustomerProtectedProps> = ({children}) => {
    const {customer} = useSelector((state: RootState) => state.customer)
    if(!customer) {
        return <Navigate to={'/login'} />
    }
    return <>{children}</>
}

export default CustomerProtected