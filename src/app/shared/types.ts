export type CurrencyOption = {
  label: string;
  fullLabel?: string;
  value: string;
  iconSrc?: string;
};

export type AvailableExchange = {
  id: string
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
