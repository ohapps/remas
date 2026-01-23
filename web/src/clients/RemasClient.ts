import axios from '../config/axios-config';
import { LedgerCategory, LedgerEntry } from '../types/ledgerTypes';
import { DefaultExpense, Expense, Offer, Property, PropertyNote, RehabEstimate } from '../types/propertyTypes';
import { TravelLog } from '../types/travelLogTypes';
import { Market, MarketQuestion, MarketQuestionUpdate, MarketRent, User } from '../types/userTypes';
import { logError } from '../utils/generalUtils';

export class RemasClientError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RemasClientError";
    }
}

class RemasClient {

    static handleError(error: Error): undefined {
        logError(error);
        throw new RemasClientError(error.message);
    }

    static getUser() {
        return axios.get<User>('/user')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getMarkets() {
        return axios
            .get<Market[]>('/markets')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createMarket(market: Market, parentId: string) {
        return axios
            .post<Market>(`/markets${parentId ? '?parentId=' : ''}${parentId}`, market)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateMarket(market: Market) {
        return axios
            .put<Market>(`/markets/${market.id}`, market)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteMarket(market: Market) {
        return axios
            .delete<Market>(`/markets/${market.id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateMarketMetric(marketId: string, questionId: string, metricValue: string) {
        return axios
            .put<Market>(`/markets/${marketId}/question/${questionId}/value`, {
                value: metricValue
            })
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createMarketQuestion(marketQuestionUpdate: MarketQuestionUpdate) {
        return axios
            .post<MarketQuestion[]>('/market-questions', marketQuestionUpdate)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateMarketQuestion(id: string, marketQuestionUpdate: MarketQuestionUpdate) {
        return axios
            .put<MarketQuestion[]>(`/market-questions/${id}`, marketQuestionUpdate)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteMarketQuestion(id: string) {
        return axios
            .delete<MarketQuestion[]>(`/market-questions/${id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createMarketRent(marketId: string, rent: MarketRent) {
        return axios
            .post<MarketRent>(`/markets/${marketId}/rent`, rent)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateMarketRent(marketId: string, rentId: string, rent: MarketRent) {
        return axios
            .put<MarketRent>(`/markets/${marketId}/rent/${rentId}`, rent)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteMarketRent(marketId: string, rentId: string) {
        return axios
            .delete<MarketRent>(`/markets/${marketId}/rent/${rentId}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getProperties() {
        return axios
            .get<Property[]>('/properties')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createProperty(property: Property) {
        return axios
            .post<Property>('/properties', property)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateProperty(property: Property) {
        return axios
            .put<Property>(`/properties/${property.id}`, property)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static archiveProperty(property: Property) {
        return axios
            .put<Property>(`/properties/${property.id}/archive`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static unarchiveProperty(property: Property) {
        return axios
            .put<Property>(`/properties/${property.id}/unarchive`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteProperty(property: Property) {
        return axios
            .delete<Property>(`/properties/${property.id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateExpense(property: Property, expense: Expense) {
        return axios
            .put<Property>(`/properties/${property.id}/expenses/${expense.id}`, expense)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createExpense(property: Property, expense: Expense) {
        return axios
            .post<Property>(`/properties/${property.id}/expenses`, expense)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteExpense(property: Property, expense: Expense) {
        return axios
            .delete<Property>(`/properties/${property.id}/expenses/${expense.id}`)
            .then(resp => resp)
            .catch(RemasClient.handleError);
    }

    static createOffer(property: Property, offer: Offer) {
        return axios
            .post<Property>(`/properties/${property.id}/offers`, offer)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateOffer(property: Property, offer: Offer) {
        return axios
            .put<Property>(`/properties/${property.id}/offers/${offer.id}`, offer)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteOffer(property: Property, offer: Offer) {
        return axios
            .delete<Property>(`/properties/${property.id}/offers/${offer.id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static markOfferActive(property: Property, offer: Offer) {
        return axios
            .put<Property>(`/properties/${property.id}/offers/${offer.id}/active`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createPropertyNote(property: Property, propertyNote: PropertyNote) {
        return axios
            .post<Property>(`/properties/${property.id}/notes`, propertyNote)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updatePropertyNote(property: Property, propertyNote: PropertyNote) {
        return axios
            .put<Property>(`/properties/${property.id}/notes/${propertyNote.id}`, propertyNote)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deletePropertyNote(property: Property, propertyNote: PropertyNote) {
        return axios
            .delete<Property>(`/properties/${property.id}/notes/${propertyNote.id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createRehabCategory(property: Property, rehabEstimate: RehabEstimate) {
        return axios
            .post<Property>(`/properties/${property.id}/rehab-estimates`, rehabEstimate)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateRehabCategory(property: Property, rehabEstimate: RehabEstimate) {
        return axios
            .put<Property>(`/properties/${property.id}/rehab-estimates/${rehabEstimate.id}`, rehabEstimate)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteRehabCategory(property: Property, rehabEstimate: RehabEstimate) {
        return axios
            .delete<Property>(`/properties/${property.id}/rehab-estimates/${rehabEstimate.id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getLedgerCategories() {
        return axios
            .get<LedgerCategory[]>('/ledger/categories')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getLedgerEntries() {
        return axios
            .get<LedgerEntry[]>('/ledger')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createLedgerEntry(entry: LedgerEntry) {
        return axios
            .post<LedgerEntry>('/ledger', entry)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateLedgerEntry(entry: LedgerEntry) {
        return axios
            .put<LedgerEntry>(`/ledger/${entry.id}`, entry)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteLedgerEntry(entry: LedgerEntry) {
        return axios
            .delete(`/ledger/${entry.id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getTravelLogs() {
        return axios
            .get<TravelLog[]>('/travel-log')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createTravelLog(travelLog: TravelLog) {
        return axios
            .post<TravelLog>('/travel-log', travelLog)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateTravelLog(travelLog: TravelLog) {
        return axios
            .put<TravelLog>(`/travel-log/${travelLog.id}`, travelLog)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteTravelLog(travelLog: TravelLog) {
        return axios
            .delete(`/travel-log/${travelLog.id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getMarketQuestions() {
        return axios
            .get<MarketQuestion[]>('/market-questions')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getDefaultExpenses() {
        return axios
            .get<DefaultExpense[]>('/default-expenses')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static createDefaultExpense(defaultExpense: DefaultExpense) {
        return axios
            .post<DefaultExpense[]>('/default-expenses', defaultExpense)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static updateDefaultExpense(defaultExpense: DefaultExpense) {
        return axios
            .put<DefaultExpense[]>(`/default-expenses/${defaultExpense.id}`, defaultExpense)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static deleteDefaultExpense(defaultExpense: DefaultExpense) {
        return axios
            .delete<DefaultExpense[]>(`/default-expenses/${defaultExpense.id}`)
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getRecentMarkets() {
        return axios.get<Market[]>('/markets/recent')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }

    static getRecentProperties() {
        return axios.get<Property[]>('/properties/recent')
            .then(resp => resp.data)
            .catch(RemasClient.handleError);
    }
}

export default RemasClient;