export type User = {
    id: string;
    name: string;
    email: string;
};
export interface Stock {
    ticker: string;
    name: string;
    description: string;
    marketCap: number;
    peRatio: number | null;
    historicalData: {
        date: string;
        price: number;
    }[];
}
