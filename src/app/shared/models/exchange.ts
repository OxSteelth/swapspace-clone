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

export type ExchangeStatusInfo = 'waiting' | 'confirming' | 'sending' | 'finished';

export interface CreatedExchange {
  id: string;
  partner: string;
  fixed: boolean;
  timestamps: {
    createdAt: string;
    expiresAt: string;
  };
  from: {
    code: string;
    network: string;
    amount: number;
    address: string;
    extraId: string;
    transactionHash: string;
  };
  to: {
    code: string;
    network: string;
    amount: number;
    address: string;
    extraId: string;
    transactionHash: string;
  };
  rate: number;
  status: ExchangeStatusInfo;
  confirmations: number;
  refundExtraId: string;
  blockExplorerTransactionUrl: {
    from: string;
    to: string;
  };
  blockExplorerAddressUrl: {
    from: string;
    to: string;
  };
}
