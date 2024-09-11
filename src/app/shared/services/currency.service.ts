import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, shareReplay } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { CurrencyOption } from '../types';
import { Currency } from '../models/currency';
import { HttpService } from 'src/app/core/services/http/http.service';

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

  private readonly _tokenList$ = new BehaviorSubject<Currency[]>([]);

  public readonly tokenList$ = this._tokenList$.asObservable();

  private readonly _popularCurrencyList$ = new BehaviorSubject<Currency[]>([]);

  public readonly popularCurrencyList$ = this._popularCurrencyList$.asObservable();

  private readonly _allCurrencyList$ = new BehaviorSubject<Currency[]>([]);

  public readonly allCurrencyList$ = this._allCurrencyList$.asObservable();

  get tokenList(): Currency[] {
    return this._tokenList$.getValue();
  }

  constructor(private readonly httpService: HttpService, private readonly destroy$: TuiDestroyService) {
    this.popularCurrencyList$ = this._popularCurrencyList$.pipe(
      switchMap(data => {
        if (data) {
          return of(data);
        } else {
          return this.httpService.get<Currency[]>(`currencies`).pipe(
            catchError(error => {
              console.error('Error fetching data', error);
              return of([]);
            })
          );
        }
      })
    );

    this.allCurrencyList$ = this._allCurrencyList$.pipe(
      switchMap(data => {
        if (data) {
          return of(data);
        } else {
          return this.httpService.get<Currency[]>(`currencies`).pipe(
            catchError(error => {
              console.error('Error fetching data', error);
              return of([]);
            })
          );
        }
      })
    );

    // this.getCurrencyList();
  }

  public fetchCurrencyList(): Observable<Currency[]> {
    return this.httpService.get<Currency[]>(`currencies`).pipe(
      shareReplay(1),
      map(tokens => {
        const popularCurrencyList: Currency[] = [];
        const allCurrencyList: Currency[] = [];

        for (const currency of tokens) {
          if (currency.popular) {
            popularCurrencyList.push(currency);
          } else {
            allCurrencyList.push(currency);
          }
        }

        this._tokenList$.next(tokens);
        this._popularCurrencyList$.next(popularCurrencyList);
        this._allCurrencyList$.next(allCurrencyList);

        return tokens.length ? tokens : [];
      })
    );
  }

  public getCurrencyList(): void {
    this.fetchCurrencyList().subscribe((currencyList: Currency[]) => {
      const popularCurrencyList: Currency[] = [];
      const allCurrencyList: Currency[] = [];

      for (const currency of currencyList) {
        if (currency.popular) {
          popularCurrencyList.push(currency);
        } else {
          allCurrencyList.push(currency);
        }
      }

      this._tokenList$.next(currencyList);
      this._popularCurrencyList$.next(popularCurrencyList);
      this._allCurrencyList$.next(allCurrencyList);
    });
  }

  public fetchQueryTokens(query: string, blockchain: string): Observable<Currency[]> {
    return of(
      this.tokenList.filter(
        token =>
          token.network === blockchain &&
          (token.name.toLowerCase().includes(query.toLowerCase()) ||
            token.code.toLowerCase().includes(query.toLowerCase()))
      )
    );
  }
}
