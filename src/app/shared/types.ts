export type CurrencyOption = {
  label: string;
  fullLabel?: string;
  value: string;
  iconSrc?: string;
};

export type AvailableExchange = {
  id: string;
  exchangeName: string;
  exchangeIconSrc?: string;
  rate: number;
  eta: {
    min: number;
    max: number;
  };
  kycRisks: 'low' | 'medium' | 'high';
  trustedPartner: boolean;
  giveaway: boolean;
};

export type CreateExchange = {
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
    contractAddress: string;
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
  status: string;
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
};
