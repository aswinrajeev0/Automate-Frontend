import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Admin {
    id: string,
    name: string,
    email: string,
    image?: string,
}

interface AdminState {
    admin: Admin | null
}

const initialState: AdminState = {
    admin: null
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminLogin: (state, action: PayloadAction<Admin>) => {
            state.admin = action.payload
        },
        adminLogout: (state) => {
            state.admin = null;
        }
    }
})

export const {adminLogin, adminLogout} = adminSlice.actions;
export default adminSlice.reducer;