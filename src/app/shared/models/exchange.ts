export interface Exchange {
  id: string;
  supportRate: number;
  duration: string;
  min: number;
  max: number;
  fixed: boolean;
  partner: string;
  exists: boolean;
  fromAmount: number;
  fromCurrency: string;
  fromNetwork: string;
  toAmount: number;
  toCurrency: string;
  toNetwork: string;
}

export type EXCHANGE_STATUS = 'CONFIRM' | 'INSERT' | 'PERFORM'
