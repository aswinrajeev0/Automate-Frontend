import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../../components/customer/Header';
import { Footer } from '../../components/customer/Footer';
import { useGetWallet } from '../../hooks/customer/useWallet';
import Transaction from '../../components/customer/wallet/Transaction';
import { ITransaction, IWallet } from '../../types/wallet.type';
import AddMoneyModal from '../../components/customer/wallet/AddMoneyModal';
import { Pagination1 } from '../../components/admin/Pagination1';

const WalletPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
    const limit = 5
    const { data } = useGetWallet(limit, currentPage)
    const wallet = data?.wallet as IWallet
    const transactions = (data?.transactions || []) as ITransaction[]
    const totalPages = Math.ceil(data?.totalTransactions/limit) || 1


    const handleAddMoney = () => {
        setIsAddMoneyModalOpen(true)
    }

    return (
        <>
            <Header />
            <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8 mx-auto max-w-7xl lg:px-8">
                {/* Header */}
                <div className="bg-blue-400 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <h1 className="text-xl font-bold mb-3 sm:mb-0">My Wallet</h1>
                        <div className="flex space-x-3">
                            {/* <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 transition">
                                <Search size={20} />
                            </button>
                            <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 transition">
                                <Filter size={20} />
                            </button> */}
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div className="mt-4 md:mt-6 bg-white text-gray-800 p-4 sm:p-5 rounded-xl md:rounded-2xl shadow-md">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="mb-4 sm:mb-0">
                                <p className="text-gray-500 font-medium">Available Balance</p>
                                <h2 className="text-2xl sm:text-3xl font-bold mt-1">₹{wallet?.balance?.toLocaleString()}</h2>
                            </div>
                            <button onClick={handleAddMoney} className="bg-yellow-300 hover:bg-yellow-400 transition py-2 px-4 rounded-full flex items-center justify-center font-semibold shadow-md w-full sm:w-auto">
                                <Plus size={20} className="mr-1" /> Add Money
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="px-0 sm:px-2 md:px-4 mt-4 md:mt-6">
                    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                        <h3 className="font-bold text-lg mb-3 sm:mb-4">Transaction History</h3>

                        <div className="space-y-2 sm:space-y-3">
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <Transaction key={transaction._id} transaction={transaction} />
                                ))
                            ) : (
                                <p className="text-center py-4 text-gray-500">No transactions yet</p>
                            )}
                        </div>

                        {/* Pagination */}
                        {transactions.length > 0 && (
                            <div className="mt-4">
                                <Pagination1
                                    currentPage={currentPage}
                                    onPageNext={() => setCurrentPage(currentPage + 1)}
                                    onPagePrev={() => setCurrentPage(currentPage - 1)}
                                    totalPages={totalPages}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            <AddMoneyModal
                isOpen={isAddMoneyModalOpen}
                onClose={() => setIsAddMoneyModalOpen(false)}
            />
        </>
    );
};

export default WalletPage;