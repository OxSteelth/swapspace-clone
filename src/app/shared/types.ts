import { ExchangeStatusInfo } from './models/exchange';

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
};

export type ExchangeStatus = {
  actualStatus: ExchangeStatusInfo;
  amountDeviation: number;
  blockExplorerAddressUrl: { from: string; to: string };
  blockExplorerTransactionUrl: { from: string; to: string };
  confirmations: number;
  duration: number;
  error: boolean;
  eta: string;
  fixed: boolean;
  from: {
    network: string;
    extraId: string;
    transactionHash: string;
    code: string;
    amount: number;
    contractAddress: string;
    address: string;
  };
  hasIssues: boolean;
  id: string;
  partner: string;
  rate: number;
  refundAddress: string;
  refundAddressSource: string;
  refundExtraId: string;
  status: ExchangeStatusInfo;
  timestamps: { createdAt: string; expiresAt: string };
  to: {
    network: string;
    extraId: string;
    transactionHash: string;
    code: string;
    amount: number;
    address: string;
  };
  type: string;
  warnings: { from: string; to: string };
};

export type Transaction = {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | null;
  cumulativeGasUsed: number;
  effectiveGasPrice: number;
  from: string;
  gasUsed: number;
  logs: string[];
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
};
