export interface Property {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    units: number;
    monthlyRent?: number;
    arv?: number;
    purchased?: string;
    inService?: string;
    listingUrl?: string;
    watchlist: boolean;
    archived: boolean;
    offers: Offer[];
    expenses: Expense[];
    rehabEstimates: RehabEstimate[];
    notes: PropertyNote[];
    metrics: Metric[];
    marketId?: string;
}

export interface Offer {
    id?: string;
    description: string;
    purchasePrice: number;
    cashDown: number;
    cashDownPercent: number;
    loanAmount: number;
    loanYears: number;
    loanRate: number;
    mortgagePayment: number;
    principalPayDown: number;
    closingCost: number;
    active: boolean;
}

export interface Expense {
    id?: string;
    description: string;
    monthlyAmount: number;
}

export interface RehabEstimate {
    id?: string;
    description: string;
    estimate: number;
}

export interface PropertyNote {
    id?: string;
    note: string;
    updatedDate?: string;
}

export enum MetricUnit {
    DOLLAR_AMOUNT = 'DOLLAR_AMOUNT',
    PERCENT = 'PERCENT'
}

export interface Metric {
    description: string;
    helpText: string;
    metric: number;
    metricUnit: MetricUnit;
}

export enum ExpenseType {
    YEARLY = 'YEARLY',
    MONTHLY = 'MONTHLY',
    PERCENT_OF_RENT = 'PERCENT_OF_RENT'
}

export interface DefaultExpense {
    id?: string;
    description: string;
    amount: number;
    expenseType: ExpenseType;
}