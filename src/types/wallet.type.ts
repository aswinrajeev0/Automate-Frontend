export interface IWallet {
    balance: number
}

export interface ITransaction {
    _id: string;
    amount: number;
    type: string;
    createdAt: Date;
    reference: string;
    description: string;
}