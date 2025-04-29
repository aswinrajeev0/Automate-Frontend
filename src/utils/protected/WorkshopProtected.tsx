import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Navigate } from "react-router-dom";

interface WorkshopProtected {
    children: React.ReactNode
}

export const WorkshopProtected: React.FC<WorkshopProtected> = ({children}) => {
    const {workshop} = useSelector((state: RootState) => state.workshop);
    if(!workshop){
        return <Navigate to={"/workshop/login"} />
    }
    return <>{children}</>
}