import { Injectable } from '@angular/core';
import { delay, Observable, of, shareReplay } from 'rxjs';
import { CurrencyOption } from '../types';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  currencyList$: Observable<CurrencyOption[]> = of([
    {
      label: 'USD',
      fullLabel: 'Dollar',
      value: 'USD',
      iconSrc: 'assets/currency-icons/usd.svg',
    },
    {
      label: 'BTC',
      value: 'BTC',
      fullLabel: 'Bitcoin',
      iconSrc: 'assets/currency-icons/btc.svg',
    },
    {
      label: 'ETH',
      value: 'ETH',
      fullLabel: 'Ethereum',
      iconSrc: 'assets/currency-icons/eth.svg',
    },
    {
      label: 'USDT',
      value: 'USDT',
      fullLabel: 'Tether',
      iconSrc: 'assets/currency-icons/usdt.svg',
    },
  ]).pipe(delay(200), shareReplay(1));

  constructor() {}
}
