import { Market, MarketQuestion } from "../types/userTypes";

export const getMarketMetricValue = (market: Market, question: MarketQuestion) => {
    return market.metrics
        .filter(metric => metric.question.id === question.id)
        .map(metric => metric.metricValue)
        .shift();
}