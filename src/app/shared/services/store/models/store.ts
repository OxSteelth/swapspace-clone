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
import { Exchange } from '@app/shared/models/exchange';
import BigNumber from 'bignumber.js';

export type Store = {
  SELECTED_OFFER: Exchange
};

export const storeRecord: Record<keyof Store, null> = {
  SELECTED_OFFER: null
};
