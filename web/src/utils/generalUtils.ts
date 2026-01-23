import { replace, capitalize, words } from "lodash";

export const isNumeric = (testValue: string): boolean => {
    const result = /^-?\d*\.?\d*$/.test(testValue);
    return result;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export const formatCurrency = (currency: number) => {
    return formatter.format(currency);
}

export const formatDate = (rawDate: string) => {
    if (rawDate) {
        const newDate = new Date(rawDate);
        return newDate.toLocaleString();
    }
    return rawDate;
}

export const formatEnum = (enumValue: string) => {
    return words(replace(enumValue, '_', ' '))
        .map(word => capitalize(word))
        .join(' ');
}

export const logError = (error: Error) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(error);
    }
}

export const logWarning = (warning: string) => {
    if (process.env.NODE_ENV === 'development') {
        console.warn(warning);
    }
}