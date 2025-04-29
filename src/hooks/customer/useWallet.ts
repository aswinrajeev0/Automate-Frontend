import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addMoney, getWallet, walletPurchase } from "../../services/customer/walletService"

export const useGetWallet = (limit: number, currentPage: number) => {
    return useQuery({
        queryKey: ["wallet", limit, currentPage],
        queryFn: () => getWallet(limit, currentPage)
    })
}

export const useAddMoney = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (amount: number) => addMoney(amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallet"] })
        }
    })
}

export const useWalletPurchase = () => {
    return useMutation({
        mutationFn: (amount: number) => walletPurchase(amount)
    })
}