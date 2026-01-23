export interface User {
    id: string;
    username: string;
}

export interface Market {
    id: string;
    description: string;
    locationType: string;
    location: string;
    metrics: MarketMetric[];
    rents: MarketRent[];
    parentMarket?: Market;
}

export interface MarketQuestion {
    id: string;
    question: string;
    answerType: string;
}

export type MarketQuestionUpdate = Omit<MarketQuestion, "id">;

export interface MarketMetric {
    id: string;
    question: MarketQuestion;
    metricValue: string;
}

export enum UnitType {
    APARTMENT = "APARTMENT",
    SINGLE_FAMILY = "SINGLE_FAMILY",
    CONDO = "CONDO"
}

export interface MarketRent {
    id?: string;
    unitType: UnitType;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    rentLow: number;
    rentHigh: number;
}