import React, { useEffect, useState } from 'react';
import { useCreateOrder, useVerifyPayment } from '../../../hooks/payment/useRazorPay';
import { useSelector } from 'react-redux';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { RootState } from '../../../store/store';
import { useToaster } from '../../../hooks/ui/useToaster';
import { useWalletPurchase } from '../../../hooks/customer/useWallet';

interface PaymentModalProps {
    isPaymentModalOpen: boolean;
    handleSubmit: (finalAmount: number, gstAmount: number) => Promise<void>;
    setIsPaymentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    bookingDetails: {
        date: Date | null;
        time: string | null;
        type: string;
        duration: number;
        price: number
    };
    setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFailedModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isPaymentModalOpen,
    handleSubmit,
    setIsPaymentModalOpen,
    bookingDetails,
    setIsConfirmationModalOpen,
    setIsFailedModalOpen
}) => {
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const createOrder = useCreateOrder()
    const { successToast, errorToast } = useToaster()

    const verifyPayment = useVerifyPayment()
    const walletPurchase = useWalletPurchase()

    const { customer } = useSelector((state: RootState) => state.customer)

    const gstRate = 18;
    const gstAmount = (bookingDetails.price * gstRate) / 100;
    const finalAmount = bookingDetails.price + gstAmount;

    const handlePayment = async () => {
        switch (paymentMethod) {
            case 'razorpay':
                return razorpayHandle();
            case 'paypal':
                // add your PayPal logic here later
                alert('PayPal integration coming soon!');
                break;
            case 'wallet':
                try {
                    const response = await walletPurchase.mutateAsync(finalAmount);
                    if (response.success) {
                        await handleSubmit(finalAmount, gstAmount);
                        setIsPaymentModalOpen(false);
                        setIsConfirmationModalOpen(true);
                    } else {
                        setIsPaymentModalOpen(false);
                        setIsFailedModalOpen(true)
                        errorToast(response.message || "Something went wrong")
                    }
                } catch (error: any) {
                    console.error(error)
                    setIsPaymentModalOpen(false)
                    setIsFailedModalOpen(true)
                    errorToast(error.message as string)
                }

                break;
            default:
                break;
        }
    };

    const razorpayHandle = async () => {
        try {
            const response = await createOrder.mutateAsync({ amount: finalAmount, currency: "INR" });
            const order = response.order;
            if (!order.id) throw new Error('Order creation failed');

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: finalAmount * 100,
                currency: 'INR',
                name: 'Automate',
                description: `${bookingDetails.type} Service`,
                image: '/logo.png',
                order_id: order.id,
                handler: async (response: any) => {
                    const verifyRes = await verifyPayment.mutateAsync({
                        order_id: order.id,
                        payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })

                    if (verifyRes.success) {
                        await handleSubmit(finalAmount, gstAmount);
                        setIsPaymentModalOpen(false);
                        setIsConfirmationModalOpen(true);
                        successToast(bookingDetails ? "booking have been confirmed" : "")
                    } else {
                        setIsPaymentModalOpen(false);
                        setIsFailedModalOpen(true)
                        errorToast("Error in requesting service")
                        // alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: customer?.name,
                    email: customer?.email,
                    contact: customer?.phone
                },
                theme: {
                    color: '#ffda73'
                },
                modal: {
                    ondismiss: () => {
                        setIsFailedModalOpen(true);
                        errorToast("Payment was not completed. Please try again.");
                    }
                }

            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error)
            setIsFailedModalOpen(true)
        }
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!isPaymentModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 ">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Complete Your Payment</h2>
                    <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Service Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-y-3">
                        <div className="text-gray-600">Service Type:</div>
                        <div className="text-blue-700 font-medium">{bookingDetails.type.toUpperCase()} Service</div>

                        {/* <div className="text-gray-600">Workshop Name:</div>
            <div className="text-blue-700 font-medium">Adonz Automotive</div> */}

                        <div className="text-gray-600">Date:</div>
                        <div className="text-blue-700 font-medium">{bookingDetails?.date?.toDateString()}</div>

                        <div className="text-gray-600">Time:</div>
                        <div className="text-blue-700 font-medium">{bookingDetails.time}</div>

                        <div className="text-gray-600">Amount:</div>
                        <div className="text-blue-700 font-medium">₹{bookingDetails.price.toLocaleString()}</div>

                        <div className="text-gray-600">GST:</div>
                        <div className="text-blue-700 font-medium">₹{gstAmount.toLocaleString()}</div>

                        <div className="text-gray-600 font-medium">Final Amount:</div>
                        <div className="text-blue-700 font-bold">₹{finalAmount.toLocaleString()}</div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Payment Method</h3>

                    {/* PayPal */}
                    {/* <div className="mb-3">
                        <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                checked={paymentMethod === 'paypal'}
                                onChange={() => setPaymentMethod('paypal')}
                                className="h-5 w-5 text-blue-600"
                            />
                            <span className="ml-3 flex-grow">PayPal</span>
                            <img src="/api/placeholder/100/30" alt="PayPal logo" className="h-8" />
                        </label>
                    </div> */}

                    {/* RazorPay */}
                    <div className="mb-3">
                        <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="razorpay"
                                checked={paymentMethod === 'razorpay'}
                                onChange={() => setPaymentMethod('razorpay')}
                                className="h-5 w-5 text-blue-600"
                            />
                            <span className="ml-3 flex-grow">RazorPay</span>
                            <img src="/razorpay-icon.png" alt="RazorPay logo" className="w-15" />
                        </label>
                    </div>

                    {/* Wallet */}
                    <div className="mb-3">
                        <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="wallet"
                                checked={paymentMethod === 'wallet'}
                                onChange={() => setPaymentMethod('wallet')}
                                className="h-5 w-5 text-blue-600"
                            />
                            <span className="ml-3 flex-grow">Wallet</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </label>
                    </div>
                </div>

                {/* Action Button */}
                {paymentMethod === 'paypal' ? (
                    <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(_data, actions) => {
                            return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: "USD",
                                            value: finalAmount.toFixed(2),
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={async (_data, actions) => {
                            const details = await actions.order?.capture();
                            if (details?.status === "COMPLETED") {
                                await handleSubmit(finalAmount, gstAmount);
                                setIsPaymentModalOpen(false);
                                setIsConfirmationModalOpen(true);
                                successToast("Payment successful and booking confirmed!");
                            } else {
                                errorToast("Something went wrong with PayPal payment.");
                            }
                        }}
                        onError={(err) => {
                            console.error("PayPal Error:", err);
                            errorToast("PayPal payment failed.");
                        }}
                    />
                ) : (
                    <button
                        onClick={handlePayment}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    >
                        Place Service - Pay ₹{finalAmount.toLocaleString()}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;