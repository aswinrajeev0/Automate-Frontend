import { StrictMode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { persistor, store } from "../../../store/store";
import { ToastContainer } from "./ToasContainer";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<StrictMode>
			<PayPalScriptProvider options={{ "clientId": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}>
				<Provider store={store}>
					<PersistGate persistor={persistor}>
						<QueryClientProvider client={queryClient}>
							<ToastContainer>{children}</ToastContainer>
						</QueryClientProvider>
					</PersistGate>
				</Provider>
			</PayPalScriptProvider>
		</StrictMode>
	);
}
