// import { WALLET_NAME } from '@core/wallets-modal/components/wallets-modal/models/wallet-name';
// import { LocalToken } from 'src/app/shared/models/tokens/local-token';
// import { RecentTrade } from '@shared/models/recent-trades/recent-trade';
// import { StorageToken } from '@core/services/tokens/models/storage-token';

// import { FormSteps } from '@core/services/google-tag-manager/models/google-tag-manager';
// import {
//   CcrSettingsForm,
//   ItSettingsForm
// } from '@features/trade/services/settings-service/models/settings-form-controls';
// import { SWAP_PROVIDER_TYPE } from '@features/trade/models/swap-provider-type';
// import { ChangenowPostTrade } from '@features/trade/models/cn-trade';
import { QueryParams } from '@app/core/services/query-params/models/query-params';
import { Currency } from '@app/shared/models/currency';
import { Exchange } from '@app/shared/models/exchange';
import { CreateExchange } from '@app/shared/types';
import BigNumber from 'bignumber.js';

export type Store = {
  FROM_TOKEN: Currency;
  FROM_CHAIN: string;
  FROM_AMOUNT: string;
  TO_TOKEN: Currency;
  TO_CHAIN: string;
  TO_AMOUNT: string;
  SELECTED_OFFER: Exchange;
  ALL_CURRENCY_LIST: Currency[];
  POPULAR_CURRENCY_LIST: Currency[];
  CREATED_EXCHANGE: CreateExchange;
  DEPOSIT_ADDRESS: string;
  EXCHANGE_STEP: number;
  RECIPIENT_ADDRESS: string;
  FILTER_FIXED_RATE: boolean;
  FILTER_FLOATING_RATE: boolean;
  AVAILABLE_EXCHANGES: Exchange[];
  FILTERED_EXCHANGES: Exchange[];
};

export const storeRecord: Record<keyof Store, null> = {
  FROM_TOKEN: null,
  FROM_CHAIN: null,
  FROM_AMOUNT: null,
  TO_TOKEN: null,
  TO_CHAIN: null,
  TO_AMOUNT: null,
  SELECTED_OFFER: null,
  ALL_CURRENCY_LIST: null,
  POPULAR_CURRENCY_LIST: null,
  CREATED_EXCHANGE: null,
  DEPOSIT_ADDRESS: null,
  EXCHANGE_STEP: null,
  RECIPIENT_ADDRESS: null,
  FILTER_FIXED_RATE: null,
  FILTER_FLOATING_RATE: null,
  AVAILABLE_EXCHANGES: null,
  FILTERED_EXCHANGES: null
};
