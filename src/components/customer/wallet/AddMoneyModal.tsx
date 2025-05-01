import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useCreateOrder, useVerifyPayment } from '../../../hooks/payment/useRazorPay';
import { useAddMoney } from '../../../hooks/customer/useWallet';
import { useToaster } from '../../../hooks/ui/useToaster';
import logo from "../../../assets/logo.png";

interface AddMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { successToast, errorToast } = useToaster()
    const createOrder = useCreateOrder()
    const verifyPayment = useVerifyPayment()
    const addMoney = useAddMoney()

    const quickAmounts = [100, 500, 1000, 2000];

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;

        setIsProcessing(true);
        try {
            const finalAmount = Number(amount)
            const response = await createOrder.mutateAsync({ amount: finalAmount, currency: "INR" });
            const order = response.order;
            if (!order.id) throw new Error('Order creation failed');

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: finalAmount * 100,
                currency: 'INR',
                name: 'Automate',
                description: `Adding money to wallet`,
                image: logo,
                order_id: order.id,
                handler: async (response: any) => {
                    const verifyRes = await verifyPayment.mutateAsync({
                        order_id: order.id,
                        payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })

                    if (verifyRes.success) {
                        await addMoney.mutateAsync(finalAmount);
                        successToast("Money added to wallet")
                        onClose()
                    } else {
                        errorToast("Error adding money to wallet")
                        // alert('Payment verification failed');
                    }
                },
                prefill: {
                    // name: customer?.name,
                    // email: customer?.email,
                    // contact: customer?.phone
                },
                theme: {
                    color: '#ffda73'
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error)

        } finally {
            setIsProcessing(false)
        }

        setTimeout(() => {
            // onAddMoney(parseFloat(amount));
            setIsProcessing(false);
            setAmount('');
            onClose();
        }, 1000);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add Money to Wallet</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-blue-700 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        {/* Amount Input */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2 font-medium">Enter Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500 text-lg">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full py-3 pl-8 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Quick Amounts */}
                        <div className="mb-6">
                            <p className="text-gray-600 text-sm mb-2">Quick Add</p>
                            <div className="flex flex-wrap gap-2">
                                {quickAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setAmount(amt.toString())}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        ₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        {/* <div className="mb-6">
                            <p className="block text-gray-700 mb-3 font-medium">Payment Method</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${paymentMethod === 'card'
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <CreditCard size={24} className="mb-2" />
                                    <span className="text-sm">Card</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${paymentMethod === 'bank'
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <Banknote size={24} className="mb-2" />
                                    <span className="text-sm">Bank</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${paymentMethod === 'upi'
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <Wallet size={24} className="mb-2" />
                                    <span className="text-sm">UPI</span>
                                </button>
                            </div>
                        </div> */}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || isProcessing}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Processing...' : 'Add Money'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMoneyModal;