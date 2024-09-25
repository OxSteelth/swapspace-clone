import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, shareReplay } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { CurrencyOption } from '../types';
import { Currency } from '../models/currency';
import { HttpService } from 'src/app/core/services/http/http.service';
import { StoreService } from './store/store.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currencyList$: Observable<CurrencyOption[]> = of([
    {
      label: 'USD',
      fullLabel: 'Dollar',
      value: 'USD',
      iconSrc: 'assets/currency-icons/usd.svg'
    },
    {
      label: 'BTC',
      value: 'BTC',
      fullLabel: 'Bitcoin',
      iconSrc: 'assets/currency-icons/btc.svg'
    },
    {
      label: 'ETH',
      value: 'ETH',
      fullLabel: 'Ethereum',
      iconSrc: 'assets/currency-icons/eth.svg'
    },
    {
      label: 'USDT',
      value: 'USDT',
      fullLabel: 'Tether',
      iconSrc: 'assets/currency-icons/usdt.svg'
    }
  ]).pipe(delay(200), shareReplay(1));

  private readonly _popularCurrencyList$ = new BehaviorSubject<Currency[]>([]);
  public readonly popularCurrencyList$ = this._popularCurrencyList$.asObservable();

  private readonly _allCurrencyList$ = new BehaviorSubject<Currency[]>([]);
  public readonly allCurrencyList$ = this._allCurrencyList$.asObservable();

  public get allCurrencyList() {
    return this._allCurrencyList$.getValue();
  }

  public get popularCurrencyList() {
    return this._popularCurrencyList$.getValue();
  }

  constructor(
    private readonly httpService: HttpService,
    private readonly destroy$: TuiDestroyService,
    private storeService: StoreService
  ) {
    if (this.storeService.getItem('CURRENCY_LIST')) {
      this._allCurrencyList$.next(this.storeService.getItem('CURRENCY_LIST'));
      this._popularCurrencyList$.next(
        this.storeService.getItem('CURRENCY_LIST').filter(token => token.popular)
      );
    }
  }

  public fetchCurrencyList(): void {
    if (!this._allCurrencyList$.getValue().length) {
      this.httpService
        .get<Currency[]>(`currencies`)
        .pipe(
          tap(tokens => {
            this.storeService.setItem('CURRENCY_LIST', tokens);
            this._allCurrencyList$.next(tokens);
            this._popularCurrencyList$.next(tokens.filter(token => token.popular));
          })
        )
        .subscribe();
    }
  }
}
