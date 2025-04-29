import React from "react";
import { ITransaction } from "../../../types/wallet.type";

const Transaction: React.FC<{transaction: ITransaction}> = ({transaction}) => {
    return (
        <div key={transaction._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "credit" ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                    {transaction.type === "credit" ? '+' : '-'}
                </div>
                <div className="ml-3">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div className={`font-bold mt-2 sm:mt-0 ${transaction.type === "credit" ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === "credit" ? '+' : '-'}₹{transaction.amount.toLocaleString()}
            </div>
        </div>
    );
};

export default Transaction;