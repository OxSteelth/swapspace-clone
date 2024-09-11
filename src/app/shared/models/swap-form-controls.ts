import BigNumber from 'bignumber.js';
import { FormGroup } from '@angular/forms';
import { FormControlType } from './utils/angular-forms-types';
import { Currency } from './currency';

export interface SwapFormInput {
  fromBlockchain: string | null;
  fromToken: Currency | null;
  fromAmount: string | null;

  toBlockchain: string | null;
  toToken: Currency | null;
}

export type SwapFormInputControl = FormControlType<SwapFormInput>;

export interface SwapFormOutput {
  toAmount: string | null;
}

export type SwapFormOutputControl = FormControlType<SwapFormOutput>;

export interface SwapForm {
  input: FormGroup<SwapFormInputControl>;
  output: FormGroup<SwapFormOutputControl>;
}
