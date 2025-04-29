import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import persistReducer from "redux-persist/es/persistReducer";
import customerReducer from './slices/customerSlice'
import workshopReducer from './slices/workshopSlice'
import adminReducer from './slices/adminSlice'

const rootPersistConfig = {
    key: "session",
    storage
};

const rootReducer = combineReducers({
    customer: customerReducer,
    workshop: workshopReducer,
    admin: adminReducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleWare) =>
        getDefaultMiddleWare({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            }
        })
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;