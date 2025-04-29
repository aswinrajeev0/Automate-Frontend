import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface Customer {
    customerId: string,
    id: string,
    name: string,
    email: string,
    image?: string,
    phone?: string,
    bio?: string,
    country?: string,
    state?: string,
    city?: string,
    streetAddress?: string,
    buildingNo?: string
}

export interface CustomerState {
    customer: Customer | null
}

const initialState: CustomerState = {
    customer: null
}

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        customerLogin: (state, action: PayloadAction<Customer>) => {
            state.customer = action.payload
        },
        customerLogout: (state) => {
            state.customer = null
        }
    }
})

export const {customerLogin, customerLogout} = customerSlice.actions;
export default customerSlice.reducer;