import axios from 'axios';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export const finnhubClient = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: {
    token: FINNHUB_API_KEY,
  },
});
