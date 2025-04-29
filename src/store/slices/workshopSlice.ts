import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Workshop {
    id: string,
    name: string,
    email: string,
    phone: string,
    image?: string,
    bio?: string,
    country: string,
    state: string,
    city: string,
    streetAddress: string,
    buildingNo: string,
}

interface WorkshopState {
    workshop: Workshop | null
}

const initialState: WorkshopState = {
    workshop: null
}

const workshopSlice = createSlice({
    name: "workshop",
    initialState,
    reducers: {
        workshopLogin: (state, action: PayloadAction<Workshop>) => {
            state.workshop = action.payload
        },
        workshopLogout: (state) => {
            state.workshop = null
        }
    }
})

export const {workshopLogin, workshopLogout} = workshopSlice.actions;
export default workshopSlice.reducer;