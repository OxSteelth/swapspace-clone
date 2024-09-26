import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, shareReplay } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { CurrencyOption } from '../types';
import { Currency } from '../models/currency';
import { HttpService } from 'src/app/core/services/http/http.service';
import { StoreService } from './store/store.service';
import { CacheService } from './cache.service';

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

  constructor(
    private readonly httpService: HttpService,
    private cacheService: CacheService
  ) {}

  public fetchCurrencyList(): void {
    this.cacheService.allCurrencyList$.subscribe(list => {
      if (list.length === 0) {
        this.httpService
          .get<Currency[]>(`currencies`)
          .pipe(
            tap(tokens => {
              this.cacheService.updateAllCurrencyList(tokens);
              this.cacheService.updatePopularCurrencyList(tokens.filter(token => token.popular));
            })
          )
          .subscribe();
      }
    });
  }
}
