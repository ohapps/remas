export interface LedgerEntry {
    id?: string;
    transactionDate: string;
    payorPayee: string;
    description: string;
    categoryId: string;
    categoryDescription?: string;
    amount: number;
    checkNo?: string;
    propertyId?: string;
    propertyDescription?: string;
    transactionType?: string;
}

export interface LedgerCategory {
    id: string;
    category: string;
    transactionType: string;
}